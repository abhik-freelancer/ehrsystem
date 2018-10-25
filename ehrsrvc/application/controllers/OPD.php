<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class OPD extends CI_Controller{
    public function __construct() {
        parent::__construct();
        $this->load->model("User_model", "user", TRUE);
        $this->load->model("Authorization_model", "authorisation", TRUE);
		$this->load->model("OPD_model", "opd", TRUE);

        
    }

	public function insertIntoOpd()
    {
        CUSTOMHEADER::getCustomHeader();
        $json_response = [];
        $headers = $this->input->request_headers();
        
        $client_token = (!empty(CUSTOMHEADER::getAuthotoken($headers))?CUSTOMHEADER::getAuthotoken($headers):"");
        
		$server_token="";
        if($client_token!=""){
            $server_token = $this->authorisation->getToken($client_token->jti)->web_token;
           
        }
       
        if($client_token!=""){
        if($client_token->jti==$server_token ){
			
			$token_data = $client_token->data;
			$hospital_id = $token_data->hospital_id;
			$doctor_id = $token_data->doctor_id;
		
            $postdata = file_get_contents("php://input");
			$request = json_decode($postdata);
			
			
            $register = $this->opd->insertIntoOPD($request,$hospital_id,$doctor_id);
			if($register){
				$json_response = [
                    "msg_status"=>HTTP_SUCCESS,
                    "msg_data"=>"Registration has been done successfully",
                ];
			}
			else{
				$json_response = [
                    "msg_status"=>HTTP_SUCCESS,
                    "msg_data"=>"There is some problem.Please try again",
                ];
			}
            
        }else{
            $json_response = [
                                "msg_status"=>HTTP_AUTH_FAIL,
                                "msg_data"=>"Authentication fail."
            ];
        }
        }else{
             $json_response = [
                                "msg_status"=>HTTP_AUTH_FAIL,
                                "msg_data"=>"Authentication fail."
            ];

        }
        header('Content-Type: application/json');
	echo json_encode( $json_response );
	exit;
        
      
    }
	
	

	    
    
}