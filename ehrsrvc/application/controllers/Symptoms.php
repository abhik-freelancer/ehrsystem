<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Symptoms extends CI_Controller{
    public function __construct() {
        parent::__construct();
      
        $this->load->model("Authorization_model", "authorisation", TRUE);
       $this->load->model("Symptom_model", "symptoms", TRUE); 
		

        
    }
	
    public function getSymptoms()
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
		
        $resultdata = $this->symptoms->getSymptoms($hospital_id);
           
		$json_response = [
                "msg_status"=>HTTP_SUCCESS,
                "msg_data"=>"Authentication ok.",
                "result"=>$resultdata
                
        ];
        }else {
            $json_response = [
                "msg_status"=>HTTP_AUTH_FAIL,
                "msg_data"=>"Authentication fail."
            ];
        }
        } else{
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
