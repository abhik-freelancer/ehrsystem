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
    
    
}
