<?php
class CUSTOMHEADER
{
    public static function getCustomHeader()
    {
		/*--- For Reference 
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Credentials: true");
		header("Access-Control-Max-Age: 1000");
		header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding,x-api-key");
		header("Access-Control-Allow-Methods: PUT, POST, GET, OPTIONS, DELETE"); 
		*/
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
    
}

