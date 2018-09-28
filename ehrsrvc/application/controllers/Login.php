<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Login  extends CI_Controller{
    
    public function __construct() {
        parent::__construct();
        $this->load->model("User_model", "user", TRUE);
        $this->load->model("Authorization_model", "authorisation", TRUE);
    }
    /**
     * @method getLogin
     * @desc Login credential will be checked here.
     * @date 28/09/2018
     */
    public function getLogin()
    {
        $json_response = [];
        
        $postdata = file_get_contents("php://input");
        $user_name = (isset($postdata['username'])!=""?$postdata['username']:"") ; //$this->input->post('username');
        $pass_word = (isset($postdata['password'])!=""?$postdata['password']:"");//$this->input->post('password');
        $user = $this->user->getUserByUsernamePwd($user_name,$pass_word);
        if($user!=NULL){
            $token = $this->authorisation->getTokenId();
            $this->jwtAction($token->web_token,$user);
            
            $json_response = array(
                                    "msg_status" => 1,
				    "msg_data" => "",
				);
        }else{
        $json_response = array(
                                    "msg_status" => 0,
				    "msg_data" => "Invalid username or password",
				);
        }
        
        header('Content-Type: application/json');
			echo json_encode( $json_response );
			exit;
    }
    
    public function jwtAction($token_id,$user){
        $token_id = $token_id;
        $issuedAt   = time();
	$notBefore  = $issuedAt + 10;             //Adding 10 seconds
	//$expire     = $notBefore + 60;            // Adding 60 seconds
	$serverName = $_SERVER['HTTP_HOST'];


	$data = [
        'iat'  => $issuedAt,         // Issued at: time when the token was generated
        'jti'  => $token_id,          // Json Token Id: an unique identifier for the token
        'iss'  => $serverName,       // Issuer
        'nbf'  => $notBefore,        // Not before
        'exp'  => NULL,           // Expire
        'data' => [                  // Data related to the signer user
            'user_id'   => $user->user_id, // userid from the users table
            'user_name' => $user->user_name,
            'user_role_name'=>$user->user_role_name
            ]
        ];
        $secreat_key = $this->config->item('enc_secrete_key');
        $jwt = JWT::encode(
        $data,      //Data to be encoded in the JWT
        $secreat_key, // The signing key
        'HS512'     // Algorithm used to sign the token, see https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40#section-3
        );
    }
    
}
