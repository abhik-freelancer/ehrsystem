<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User_model extends CI_Model {
    public function getUserByUsernamePwd($username,$password)
    {
        $user_detail="";
        $where_clause =["users.user_name"=>$this->db->escape_str($username),
                        "users.PASSWORD"=>md5($password),
                        "users.is_active"=>'Y'
                ];
        $query = $this->db->select("users.*,user_role.*")
                          ->from("users")
                          ->join("user_role","users.user_role_id=user_role.id")
                          ->where($where_clause)
                          ->get();
       if($query->num_rows()>0)
       {
           $user_detail = $query->row();
           
       }
       return $user_detail;
    }
    
}
