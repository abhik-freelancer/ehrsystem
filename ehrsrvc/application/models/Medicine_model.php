<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Medicine_model extends CI_Model{
    
	/**
     * @name getMedicineBySymptoms
     * @author Mithilesh Routh
     * @return $data
     * @desc get relations list
     */
	
	public function getMedicineBySymptoms($request){
		$resultdata = "";
		
		$values = $request->medicine;
		$diseaseIDs = [];
		for($i = 0; $i < count($values) ; $i++){
			array_push($diseaseIDs , $values[$i]->id);
		}
		
	
		
		$query = $this->db->select("medicine.medicine_id,medicine.medicine_name")
                         ->from("diagonesis_medicine_map") 
						  ->join("medicine","medicine.medicine_id = diagonesis_medicine_map.medicine_id","INNER")
						 ->order_by('medicine.medicine_name')
						 ->where_in('diagonesis_medicine_map.diagonosis_id', $diseaseIDs)
						 ->get();
		//echo $this->db->last_query();
        if($query->num_rows()>0) {
            $resultdata=$query->result();
            }
        return $resultdata;
	}

    
}
