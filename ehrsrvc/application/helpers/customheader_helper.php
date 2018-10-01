<?php
class CUSTOMHEADER
{
    public static function getCustomHeader()
    {
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Credentials: true");
		header("Access-Control-Max-Age: 1000");
		header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding,x-api-key");
		header("Access-Control-Allow-Methods: PUT, POST, GET, OPTIONS, DELETE"); 
    }
    public static function getHeaderX_API_Token()
    {
		$key = "";
                $key = $_SERVER['HTTP_X_API_KEY'];
		return $key;
    }
	
    public static function getRequestHTTP_Origin()
    {
		$origin = "";
                $origin = $_SERVER['HTTP_ORIGIN'];
		return $origin;
    }
    
    public static function getAuthotoken($header)
    {
        //$token_identification = "";
        $token="";
        if(!empty($headers['Authorization'])){
        $string_authorisation = explode(" ", $header);
        $secreat_key =config_item('enc_secrete_key'); //$this->config->item('enc_secrete_key');
        $token = JWT::decode($string_authorisation[1], $secreat_key, array('HS512'));
        }
        //$token_identification = $token->jti;
        return $token;
        
    }
}

