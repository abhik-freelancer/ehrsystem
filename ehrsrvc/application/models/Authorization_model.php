<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Authorization_model extends CI_Model{
  public function getToken($domain,$key,$project){
      $authorization="";
      $where_arr =["web_token"=>$key,
                   "domain"=>$domain,
                   "project"=>$project ];
      $query = $this->db->select("web_token.*")
                        ->where($where_arr)
                        ->get("web_token");
      
  }
  public function getTokenId()
  {
      $token="";
      $query = $this->db->select("web_token.*")->get("web_token");
      if($query->num_rows()>0){
          $token = $query->row();
      }
      return $token;        
  }
  
}
