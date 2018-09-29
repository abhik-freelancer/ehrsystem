<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Dashboard extends CI_Controller {
   
    public function __construct() {
        parent::__construct();
        $this->load->model("User_model", "user", TRUE);
        $this->load->model("Authorization_model", "authorisation", TRUE);
    }
    
    public function index()
    {
        CUSTOMHEADER::getCustomHeader();
        $token_test="Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE1MzgxNDAyNjIsImp0aSI6IjlVU2t5SGpCUHJPMkhIcEhPbVd3ZVJjTUJiMEQ5bUk1IiwiaXNzIjoiMTkyLjE2OC4yLjE2OjgwODgiLCJuYmYiOjE1MzgxNDAyNzIsImV4cCI6bnVsbCwiZGF0YSI6eyJ1c2VyX2lkIjoiMSIsInVzZXJfbmFtZSI6ImFkbWluIiwidXNlcl9yb2xlX25hbWUiOiJBRE1JTiJ9fQ.MStfbgon6tSeZ_QcLIjo1uenVDcd6NxT10tiJlS67X2Xdfr9uUTIOuhHvmGSAcWapP_zF5CU4aD1f-V126AW7g";
        $headers = $this->input->request_headers();
       //$headers = apache_request_headers();
       //$token_string = $headers['Authorization'];
       
      $token_string=explode(" ", $token_test);
       
       //$jwt_token_filter = explode(" ", $token_test);
       // echo "Auth  :: ". $headers['Authorization'] ;
        //$jwt_return_token = $headers['Authorization'];
        //$requestApiKey = CUSTOMHEADER::getHeaderX_API_Token();
        $secreat_key = $this->config->item('enc_secrete_key');
        $token = JWT::decode($token_string[1], $secreat_key, array('HS512'));
	echo('<pre>');
        print_r($token);
        echo('</pre>');
        exit();
    }
}
