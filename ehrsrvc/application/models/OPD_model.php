<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class OPD_model extends CI_Model{
    
	public function __construct() {
        parent::__construct();
		$this->load->model("Patient_model", "patient", TRUE);
	}
	
	public function insertIntoOPD($request,$hospital_id,$doctor_id){
		
		try{
			
			$this->db->trans_begin();
			$insert_data = [];
			$healthProfileArry = [];
			$opdPrescriptionArry = [];
			$todaydt = date("Y-m-d H:i:s");
			
			$opdPrecesptionID = $this->getLatestPrescriptionID($hospital_id);
			
			$healthPrf = $request->healthprofile;
			$pcode = $healthPrf->hdnpatientID;
			$patientid = $this->patient->getPatientByCode($pcode)->patient_id;
			
			$pulse = $healthPrf->pulse;
			$tempratute = $healthPrf->tempratute;
			$anaemia = $healthPrf->anaemia;
			$bp = $healthPrf->bp;
			$jaundice = $healthPrf->jaundice;
			$odema = $healthPrf->odema;
			$height = $healthPrf->height;
			$weight = $healthPrf->weight;
			
			
			
			
			$opdForm = $request->opdform;
			
			$symptoms = $opdForm->symptomsMultiCtrl;
			$diagnosis = $opdForm->diagnosisMultiCtrl;
			
			$symptomList = $this->getArrayIDAsString($symptoms);
			$diagnosisList = $this->getArrayIDAsString($diagnosis);
			
			$acc_approval = $opdForm->approvalCtrl ? 'Y' : 'N';
			$sickFlag = $opdForm->sickCtrl ? 'Y' : 'N';
			$noofdaysSick = $opdForm->sickdaysCtrl;
			$ipd_reco = $opdForm->admitCtrl ? 'R' : 'S';
			$hospital_reco = $opdForm->observCtrl ? true : false; 
			$referal_hospital = $opdForm->isReffHospital ? true : false;
			$keep_in_observation = $opdForm->observCtrl ? true : false;
			$comments = $opdForm->finalsummryCtrl;
			
			
			$opdPrescriptionArry = [
				"opd_prescription_id" => $opdPrecesptionID, 
				"hospital_id" => $hospital_id,
				"date" => $todaydt,
				"patient_id" => $patientid,
				"doctor_id" => $doctor_id,
				"accidental_approval" => $acc_approval,
				"symptom_list" => $symptomList,
				"diagonised_list" => $diagnosisList,
				"sick_flag" => $sickFlag,
				"no_of_days_sick" => $noofdaysSick,
				"ipd_reco_flag" => NULL,
				"hospital_rec_flag" => NULL,
				"referal_hospital_id" => NULL,
				"keep_in_observation" => $keep_in_observation,
				"comments" => $comments
			];
			
			$this->db->insert('opd_prescription', $opdPrescriptionArry); 
			$opd_precp_id = $this->db->insert_id();
		
			$healthProfileArry = [
				"patient_id" => $patientid,
				"date" => $todaydt,
				"prescription_addmission_id" => $opd_precp_id,
				"opd_ipd_flag" => 'O',
				"pulse" => $pulse,
				"temp" => $tempratute,
				"anemia" => $anaemia,
				"bp" => $bp,
				"jaundice" => $jaundice,
				"odema" => $odema,
				"height" => $height,
				"weight" => $weight,
				"comment" => NULL
			];
			
			$this->db->insert('patient_health_profile', $healthProfileArry); 
			
			
			$medInsert = $this->insertIntoMedicines($hospital_id,$opd_precp_id,$request->medicines);
			$testReportinsert = $this->insertIntoTestReports($hospital_id,$opd_precp_id,$request->reports);
			
			
		/*	
			echo "<pre>";
			print_r($opdPrescriptionArry);
			echo "</pre>";
		*/
			
			
			if($this->db->trans_status() === FALSE) {
                $this->db->trans_rollback();
				return false;
            } else {
				$this->db->trans_commit();
                return true;
            }
				
		}
		catch(Exception $exc){
			 echo $exc->getTraceAsString();
		}
		
	}
	
	private function insertIntoMedicines($hospital_id,$opd_precp_id,$medicineData){
		if(isset($medicineData)){
			$len = count($medicineData);
			$insert_arry = [];
			for($i=0; $i<$len; $i++){
				
				$medicinerow = $medicineData[$i]->medicinetd;
				$doserow = $medicineData[$i]->dosagetd;
				$frequencyrow = $medicineData[$i]->unittd;
					
			
				
				$insert_arry = [
					"hospital_id" => $hospital_id,
					"prescription_admission_id" => $opd_precp_id,
					"opd_ipd_flag" => 'O',
					"medicine_id" => $medicinerow->id,
					"dose_id" => $doserow->id,
					"frequeny" => $frequencyrow->id,
					"number_of_days_sick_leave" => $medicineData[$i]->daystd
				];
				
				// insert query
				$this->db->insert('opd_ipd_medicine', $insert_arry); 
			
			}
			
		}
		
	}
	
	private function insertIntoTestReports($hospital_id,$opd_precp_id,$reportsData){
		if(isset($reportsData)){
			$len = count($reportsData);
			$insert_arry = [];
			for($i=0; $i<$len; $i++){
				
				$testsrow = $reportsData[$i]->reports;
				
				$insert_arry = [
					"hospital_id" => $hospital_id,
					"prescription_addmission_id" => $opd_precp_id,
					"opd_ipd_flag" => 'O',
					"test_id" => $testsrow->id,
					"date" => date('Y-m-d',strtotime($reportsData[$i]->invdate))
				];
				
				$this->db->insert('opd_ipd_test', $insert_arry); 
			}
			
		}
	}
	
	public function getLatestPrescriptionID($hospital_id){
		$lastnumber = 0;
		$nextPrescptionID = 0;
		
		$where = [
			"opd_prescription.hospital_id" => $hospital_id
		];
		
		$query = $this->db
						 ->select("*")
                         ->from("opd_prescription") 
						 ->where($where)
						 ->limit(1)
						 ->order_by('opd_prescription.id','DESC')
                         ->get();
		if($query->num_rows()>0)
		{
			$row = $query->row();
			$lastnumber = $row->id;
        }
		
		$digit = (int)(log($lastnumber,10)+1) ;  
        if($digit==5){
            $nextPrescptionID = $lastnumber;
        }
		elseif ($digit==4) {
            $nextPrescptionID = "0".$lastnumber;
        }
		elseif($digit==3){
            $nextPrescptionID = "00".$lastnumber;
        }
		elseif($digit==2){
            $nextPrescptionID = "000".$lastnumber;
        }
		elseif($digit==1){
            $nextPrescptionID = "0000".$lastnumber;
        }
		return $nextPrescptionID;
		
	}
	
	private function getArrayIDAsString($datas){
		$ids = "";
		$len = count($datas);
		for($i=0;$i<$len; $i++){
			$ids .= $datas[$i]->id.",";
		}
		$ids_expl = rtrim($ids,',');
		return $ids_expl;
	}
	
    /**
     * @name getTodayRegistration
     * @author Mithilesh Routh
     * @return $data
     * @desc get all todays registration data
     */
    public function getTodayRegistration($hospitalid)
    {
        $resultdata = "";
		$today = date("Y-m-d");
		$where = [
			"DATE_FORMAT(registration.date_of_registration,'%Y-%m-%d')" => $today,
			"registration.hospital_id" => $hospitalid
		];
	
		$query = $this->db->select("
									patients.patient_code,
									patients.patient_name,
									DATE_FORMAT(patients.`dob`,'%d-%m-%Y') As birthdate,
									patients.gender,
									patients.division_number,
									patients.challan_number,
									patients.line_number,
									patients.mobile_one,
									patients.adhar
								",FALSE)
                         ->from("registration") 
						 ->join("patients","patients.patient_id = registration.patient_id","INNER")
						 ->where($where)
						 ->order_by('registration.date_of_registration','DESC')
                         ->get();
		
        if($query->num_rows()>0) {
            $resultdata=$query->result();
            }
        return $resultdata;
    }
    
	
	/**
     * @name registerPatient
     * @author Mithilesh Routh
     * @return $patient_data
     * @desc register patient datas
     */
	 
    public function registerPatient($request,$hospital_id)
    {
       		try {
		
            $this->db->trans_begin();
			$reg_data = [];
				$pcode = $request->values;
				
				$regdate = date("Y-m-d H:i:s");
				
			$patientid = $this->patient->getPatientByCode($pcode)->patient_id;
			
			$reg_data = [
					"hospital_id" => $hospital_id,
					"date_of_registration" => $regdate,
					"patient_id" => (trim(htmlspecialchars($patientid))),
					"served_flag" => "N"
				];
			
			$this->db->insert('registration', $reg_data);
			
			if($this->db->trans_status() === FALSE) {
                $this->db->trans_rollback();
				return false;
            } else {
				$this->db->trans_commit();
                return true;
            }
        } 
		catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }
	
	public function searchPatient($request){
		$patient_data="";
		$searchType = $request->stype;
		$formValue = $request->values;
		if($searchType=="BASIC"){
			
			$patientID = $formValue->patientID;
			$patientAadhar = $formValue->patientAadhar;
			
			 $query = $this->db->select("patients.*,patient_type.*")
                         ->from("patients") 
                         ->join("patient_type","patients.patient_type_id = patient_type.patient_type_id","LEFT")
						 ->where("(patients.patient_code = '$patientID' OR patients.adhar = '$patientAadhar')")
                         ->get();
		}
		else if($searchType=="ADV"){
			$patientName = $formValue->patientNameCtrl;
			$patientDOB = $formValue->patientDOBCtrl;
			$patientMobile = $formValue->patientMobileCtrl;
			
			$where = [
				"patients.patient_name" => $patientName,
				"patients.dob" => $patientDOB,
				"patients.mobile_one" => $patientMobile
			];
			
			 $query = $this->db->select("patients.*,patient_type.*")
                         ->from("patients") 
                         ->join("patient_type","patients.patient_type_id = patient_type.patient_type_id","LEFT")
						 ->where($where)
                         ->get();
		}
		//echo $this->db->last_query();
		if($query->num_rows()>0){
				$patient_data = $query->row();
            }
        return $patient_data;
	}
	
	
	public function isRegisteredToday($request,$hospital_id){
		$isAlreadyReg = false;
		
		$regdate = date("Y-m-d");
		$searchType = $request->stype;
		$formValue = $request->values;
		
	
		
		if($searchType=="BASIC"){
			$pdetail = $formValue->patientID;
			$padhardtl = $formValue->patientAadhar;
		
			$patient_id = NULL ; 
			if($padhardtl){
				 $patient_id = $padhardtl->id;
			}
			if($pdetail){
				$patient_id = $pdetail->id;
			}
			$where = [
				"registration.hospital_id" => $hospital_id,
				"registration.patient_id" => $patient_id,
				"DATE_FORMAT(registration.date_of_registration,'%Y-%m-%d')" => $regdate
			];
			$query = $this->db
						 ->select("*")
                         ->from("registration") 
                         ->where($where)
                         ->get();
			
				//echo $this->db->last_query();
		}
		else if($searchType=="ADV"){
			$patientName = $formValue->patientNameCtrl;
			$patientDOB = $formValue->patientDOBCtrl;
			$patientMobile = $formValue->patientMobileCtrl;
			
			
			
			
			$where = [
				"registration.hospital_id" => $hospital_id,
				"DATE_FORMAT(registration.date_of_registration,'%Y-%m-%d')" => $regdate,
				"patients.patient_name" => $patientName,
				"DATE_FORMAT(`patients`.`dob`,'%Y-%m-%d')" => date('Y-m-d', strtotime($patientDOB)),
				"patients.mobile_one" => $patientMobile
			];
			
			$query = $this->db
						 ->select("*")
                         ->from("registration") 
						 ->join("patients","patients.patient_id = registration.patient_id" , "INNER")
                         ->where($where)
                         ->get();
		}
		//echo $this->db->last_query();
		if($query->num_rows()>0)
		{
			$isAlreadyReg = true;
        }
        return $isAlreadyReg;
	}
	
	
	/**
     * @name getTodaysRegDoct
     * @author Mithilesh Routh
     * @return $data
     * @desc get all todays registration data for doctors
     */
    public function getTodaysRegDoct($hospitalid,$request)
    {
        $resultdata = "";
		$today = date("Y-m-d");
		
		$type = $request->type;
		$serve = $request->serve;
		
		$conditional_where = [];
		
		if($type == "P/W" || $type == "T/W" || $type == "N/W" || $type == "Dep"){
			$conditional_where = [
					"registration.served_flag" => $serve,
					"patient_type.alias_code" => $type
				];
		}
		else if($type == "ALL"){
			$conditional_where = [
					"registration.served_flag" => $serve
				];
		}
		else if($type == "VISITED"){
			$conditional_where = [
					"registration.served_flag" => $serve
				];
		}
		else {
			$conditional_where = [];
		}
		
		
		$where = [
			"DATE_FORMAT(registration.date_of_registration,'%Y-%m-%d')" => $today,
			"registration.hospital_id" => $hospitalid
		];
	
		$query = $this->db->select("
									patients.patient_code,
									patients.patient_name,
									DATE_FORMAT(patients.`dob`,'%d-%m-%Y') As birthdate,
									patients.gender,
									patients.division_number,
									patients.challan_number,
									patients.line_number,
									patients.mobile_one,
									patients.adhar
								",FALSE)
                         ->from("registration") 
						 ->join("patients","patients.patient_id = registration.patient_id","INNER")
						 ->join("patient_type","patient_type.patient_type_id = patients.patient_type_id","INNER")
						 ->where($where)
						 ->where($conditional_where)
						 ->order_by('registration.date_of_registration')
                         ->get();
		
        if($query->num_rows()>0) {
            $resultdata=$query->result();
            }
        return $resultdata;
    }
	

    
}
