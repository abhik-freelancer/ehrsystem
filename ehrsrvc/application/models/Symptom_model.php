<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Symptom_model extends CI_Model{
    
	
    /**
     * @name getSymptoms
     * @author Mithilesh Routh
     * @return $data
     * @desc get all symptoms list
     */
    public function getSymptoms($hospitalid)
    {
        $resultdata = "";
		$where = [
			"symptoms.hospital_id" => $hospitalid
		];
	
		$query = $this->db->select("*")
                         ->from("symptoms") 
						  ->where($where)
						 ->order_by('symptoms.symptom')
                         ->get();
		
        if($query->num_rows()>0) {
            $resultdata=$query->result();
            }
        return $resultdata;
    }
    
	

    
}
