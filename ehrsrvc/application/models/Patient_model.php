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
        $query = $this->db->select("patients.*,patient_type.*")
                         ->from("patients") 
                         ->join("patient_type","patients.patient_type_id = patient_type.patient_type_id","LEFT")
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
	
    
}
