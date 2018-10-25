<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Patient_model extends CI_Model{
    
    /**
     * @name getPatientList
     * @author Abhik Ghosh<amiabhik@gmail.com>
     * @return $patient_data
     * @desc get all patient and their type
     */
    public function getPatientList()
    {
        $patient_data="";
      /*  $query = $this->db->select("patients.*,patient_type.*")
                         ->from("patients") 
                         ->join("patient_type","patients.patient_type_id = patient_type.patient_type_id","LEFT")
                         ->get(); */
		
		$query = $this->db->select("patients.patient_id,patients.patient_code,patients.patient_name,patients.mobile_one,patients.employee_id,patients.adhar")
                         ->from("patients") 
						 ->get();
        if($query->num_rows()>0){
            $patient_data=$query->result();
            }
        return $patient_data;
    }
    
	
	/**
     * @name registerPatient
     * @author Mithilesh Routh
     * @return $patient_data
     * @desc register patient datas
     */
	 
    public function registerPatient($request)
    {
       		try {
		
            $this->db->trans_begin();
			$reg_data = [];
				$hospital_id = $request->hospital_id;
				$regdata = $request->values;
				
				$formatedate = new DateTime($regdata->regdate);
				$reg_date =  $formatedate->format('Y-m-d H:i:s'); 
				
				
				$patient_id = $regdata->hdnPatientID;
				
				$reg_data = [
					"hospital_id" => (trim(htmlspecialchars($hospital_id))),
					"date_of_registration" => trim(htmlspecialchars($reg_date)),
					"patient_id" => (trim(htmlspecialchars($patient_id))),
					"served_flag" => "N"
				];
			
			
		//	$this->db->insert('registration', $reg_data);
			
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
	
	
	/**
     * @name addNewPatient
     * @author Mithilesh Routh
     * @return $patient_data
     * @desc register patient datas
     */
	 
    public function addNewPatient($request)
    {
       		try {
		
            $this->db->trans_begin();
			$patient_data = [];
				
				$patientdata = $request->values;
				
				$formatedate = new DateTime($patientdata->dobCtrl);
				
				$pcode = $patientdata->pcodeCtrl;
				$pname = $patientdata->pnameCtrl;
				$ptypeid = $patientdata->patienttypeCtrl;
				$lineno = $patientdata->linenoCtrl;
				$divisionno = $patientdata->divisionCtrl;
				$challanno = $patientdata->challannoCtrl;
				$estate = $patientdata->estateCtrl;
				$dob =  $formatedate->format('Y-m-d'); 
				$gender = $patientdata->genderCtrl;
				
				$employeeid = NULL;
				if(isset($patientdata->associateCtrl)){
					$employeeid = $patientdata->associateCtrl;
				}
				$aadhar = $patientdata->aadharCtrl;
				$mobile = $patientdata->mobileCtrl;
				$alternatembl = $patientdata->alternatemblCtrl;
				$bloodgrp = $patientdata->bldgrpCtrl;
				$relation_id = $patientdata->relationCtrl;
				
				$patient_data = [
					"patients.patient_code" => trim(htmlspecialchars($pcode)),
					"patients.patient_name" => trim(htmlspecialchars($pname)),
					"patients.patient_type_id" => $ptypeid,
					"patients.line_number" => trim(htmlspecialchars($lineno)),
					"patients.division_number" => trim(htmlspecialchars($divisionno)),
					"patients.challan_number" => trim(htmlspecialchars($challanno)),
					"patients.estate" => $estate,
					"patients.dob" => $dob,
					"patients.gender" => trim(htmlspecialchars($gender)),
					"patients.employee_id" => $employeeid,
					"patients.adhar" => trim(htmlspecialchars($aadhar)),
					"patients.mobile_one" => trim(htmlspecialchars($mobile)),
					"patients.mobile_two" => trim(htmlspecialchars($alternatembl)),
					"patients.blood_group" => $bloodgrp,
					"patients.relation_id" => $relation_id
				];
			
				$this->db->insert('patients', $patient_data);
			
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
			$pdetail = $formValue->patientID;
			$padhardtl = $formValue->patientAadhar;
			
			$pAadharNo = NULL;
			$pId = NULL;
			
			if($padhardtl){
				 $pAadharNo = $padhardtl->aadhar;
			}
			if($pdetail){
				 $pId = $pdetail->code;
			}

				$query = $this->db->select("patients.*,DATE_FORMAT(patients.dob,'%d-%m-%Y') AS pdob,patient_type.*",FALSE)
                         ->from("patients") 
                         ->join("patient_type","patients.patient_type_id = patient_type.patient_type_id","LEFT")
						 ->where("(patients.patient_code = '$pId' OR patients.adhar = '$pAadharNo')")
                         ->get();
						
		}
		else if($searchType=="ADV"){
			$patientName = $formValue->patientNameCtrl;
			$patientDOB = $formValue->patientDOBCtrl;
			$patientMobile = $formValue->patientMobileCtrl;
			
			$where = [
				"patients.patient_name" => $patientName,
				"DATE_FORMAT(patients.dob,'%Y-%m-%d')" =>  date('Y-m-d', strtotime($patientDOB)),
				"patients.mobile_one" => $patientMobile
			];
			
			 $query = $this->db->select("patients.*,
										DATE_FORMAT(patients.dob,'%d-%m-%Y') AS pdob,
										patient_type.*",FALSE)
                         ->from("patients") 
                         ->join("patient_type","patients.patient_type_id = patient_type.patient_type_id","LEFT")
						 ->where($where)
                         ->get();
		}
		
		if($query->num_rows()>0){
				$patient_data = $query->row();
            }
        return $patient_data;
	}
	
		public function getPatientByCode($pcode) {
		$patient_data="";
		$where = [
			"patients.patient_code" => $pcode
		];
		$query = $this->db->select("patients.*,patient_type.*")
                         ->from("patients") 
                         ->join("patient_type","patients.patient_type_id = patient_type.patient_type_id","LEFT")
						 ->where($where)
                         ->get();
						
		if($query->num_rows()>0){
				$patient_data = $query->row();
            }
        return $patient_data;
	}

    
}
