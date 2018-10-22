<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Estate_model extends CI_Model{
    
	/**
     * @name getEstate
     * @author Mithilesh Routh
     * @return $data
     * @desc get estate list
     */
	
	public function getEstate(){
		$data = "";
		$query = $this->db->select("*")->from("estate")->get();
		if($query->num_rows()>0){
            $data=$query->result();
        }
        return $data;
	}

    
}
