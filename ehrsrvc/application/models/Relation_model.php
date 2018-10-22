<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Relation_model extends CI_Model{
    
	/**
     * @name getRelations
     * @author Mithilesh Routh
     * @return $data
     * @desc get relations list
     */
	
	public function getRelations(){
		$data = "";
		$query = $this->db->select("*")->from("relationship_master")->get();
		if($query->num_rows()>0){
            $data=$query->result();
        }
        return $data;
	}

    
}
