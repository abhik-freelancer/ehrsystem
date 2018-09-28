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
                        ->get(web_token);
      
  }  
}
