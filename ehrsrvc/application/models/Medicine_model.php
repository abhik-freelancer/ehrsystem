<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Medicine_model extends CI_Model{
    
	/**
     * @name getMedicineBySymptoms
     * @author Mithilesh Routh
     * @return $data
     * @desc get medicine by diagnosis list
     */
	
	public function getMedicineBySymptoms($request){
		$resultdata = "";
		
		$values = $request->medicine;
		$diseaseIDs = [];
		for($i = 0; $i < count($values) ; $i++){
			array_push($diseaseIDs , $values[$i]->id);
		}
		
	
		
		$query = $this->db->select("medicine.medicine_id,medicine.medicine_name,medicine.medicine_type")
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
	
	/**
     * @name getDosageByMedicine
     * @author Mithilesh Routh
     * @return $data
     * @desc get dosage by medicine
     */
	
	public function getDosageByMedicine($request){
		$resultdata = "";
		
		$values = $request->medicine;
		$type = $values->type;
		
		$where = [
			"medicine_dosage.medicine_type_id" => $type
		];
	
		
		$query = $this->db->select("*")
                         ->from("medicine_dosage") 
						 ->where($where)
						 ->order_by('medicine_dosage.srl')
						 ->get();
		//echo $this->db->last_query();
        if($query->num_rows()>0) {
            $resultdata=$query->result();
            }
        return $resultdata;
	}
	
	/**
     * @name getFrequencyByMedicine
     * @author Mithilesh Routh
     * @return $data
     * @desc get frequency by medicine
     */
	
	public function getFrequencyByMedicine($request){
		$resultdata = "";
		
		$values = $request->medicine;
		$type = $values->type;
		
		$where = [
			"frequency_master.medicine_type" => $type
		];
	
		$query = $this->db->select("*")
                         ->from("frequency_master") 
						 ->where($where)
						 ->get();
		
        if($query->num_rows()>0) {
            $resultdata=$query->result();
            }
        return $resultdata;
	}

    
}
