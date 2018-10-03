<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Patient extends CI_Controller{
    public function __construct() {
        parent::__construct();
        $this->load->model("User_model", "user", TRUE);
        $this->load->model("Authorization_model", "authorisation", TRUE);
        $this->load->model("Menu_model", "menu", TRUE);
        $this->load->model("Patient_model", "patient", TRUE);

        
    }
    public function getAllPatient()
    {
        CUSTOMHEADER::getCustomHeader();
        $json_response = [];
        $headers = $this->input->request_headers();
        $client_token = (CUSTOMHEADER::getAuthotoken($headers)!=""?CUSTOMHEADER::getAuthotoken($headers):"");
        if($client_token!=""){
            $server_token = $this->authorisation->getToken($client_token->jti);
        }
        if($client_token!=""){
        if($client_token->jti==$server_token ){
            
            $patient = $this->patient->getPatientList();
             $json_response = [
                                  "msg_status"=>HTTP_SUCCESS,
                                  "msg_data"=>"Authentication ok.",
                                  "patient"=>$patient
                                  
            ];
        }else{
            $json_response = [
                                "msg_status"=>HTTP_AUTH_FAIL,
                                "msg_data"=>"Authentication fail."
            ];
        }
        }else{
//             $json_response = [
//                                "msg_status"=>HTTP_AUTH_FAIL,
//                                "msg_data"=>"Authentication fail."
//            ];
            $patient = $this->patient->getPatientList();
             $json_response = [
                                  "msg_status"=>HTTP_SUCCESS,
                                  "msg_data"=>"Authentication ok.",
                                  "patient"=>$patient
                                  
            ];
        }
        header('Content-Type: application/json');
	echo json_encode( $json_response );
	exit;
        
      
    }
    
    
}
