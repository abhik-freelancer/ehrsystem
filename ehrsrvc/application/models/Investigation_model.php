<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Investigation_model extends CI_Model{
    
	/**
     * @name getInvestigations
     * @author Mithilesh Routh
     * @return $data
     * @desc get investigation list
     */
	
	public function getInvestigations(){
		$data = "";
		$query = $this->db->select("*")->from("investigation")->order_by('investigation.investigation_name')->get();
		if($query->num_rows()>0){
            $data=$query->result();
        }
        return $data;
	}

    
}
