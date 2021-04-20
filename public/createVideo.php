<?php
	// Start PHP session and check CSRF Token
	@ob_start();

	@session_start();

	$sid   = session_id();

	$rand  = intval($_SESSION['createVideoRand' ]);
	$token = trim(strval($_SESSION['createVideoToken']));
	$time  = intval($_SESSION['createVideoTime' ]);
	$token0 = trim(strval($_REQUEST['csrfToken']));

	$attachmentCode = "KJMj4SCR2qMwSbwjyEYw-786" ;

if (strlen($token) < 1 || strlen($token0) < 1)
{
	header('HTTP/1.0 403 Forbidden');
	echo 'Forbidden Empty Token';
	#print_r($_REQUEST);
	#print_r($_SESSION);
	exit;
}

if (($rand == 0) || ($time < 0))
{
	header('HTTP/1.0 403 Forbidden');
	echo 'Forbidden Empty Random Time';
	#print_r($_REQUEST);
	#print_r($_SESSION);
	exit;
}

if ($token0 != $token)
{
	header('HTTP/1.0 403 Forbidden');
	echo 'Forbidden Token';
	exit;
}

	$videoList           = trim(strval($_REQUEST["videoList"]        ));
	$recipientName       = trim(strval($_REQUEST["recipientName"]    ));
	$senderEmail         = trim(strval($_REQUEST["senderEmail"]      ));
	$companyName         = trim(strval($_REQUEST["companyName"]      ));
	$acceptTerms         = trim(strval($_REQUEST["acceptTerms"]      ));
	$imageCompanyLogoUrl = trim(strval($_REQUEST["imageCompanyLogoUrl"] ));

	# Replace double quotes
        $videoList           = str_replace('"', "'", $videoList      );
        $recipientName       = str_replace('"', "'", $recipientName  );
        $senderEmail         = str_replace('"', "'", $senderEmail    );
        $companyName         = str_replace('"', "'", $companyName    );
        $acceptTerms         = str_replace('"', "'", $acceptTerms    );
	$imageCompanyLogoUrl = str_replace('"', "'", $imageCompanyLogoUrl);

	# Replace spaces and escape sequence with space
	$bad = array("\r","\n","\t","\f", " ", "\\", "\0");
	$videoList           = str_replace($bad, " ", $videoList      );
	$recipientName       = str_replace($bad, " ", $recipientName  );
	$senderEmail         = str_replace($bad, " ", $senderEmail    );
	$companyName         = str_replace($bad, " ", $companyName    );
	$acceptTerms         = str_replace($bad, " ", $acceptTerms    );
	$imageCompanyLogoUrl = str_replace($bad, " ", $imageCompanyLogoUrl );

if ($acceptTerms != "true")
{
        header('HTTP/1.0 403 Forbidden');
        echo 'Forbidden Please Accept Terms';
        exit;
}

#	$regexp = "/[^A-Za-z0-9@:;,\\.\\-\\+\\&\\_ ]+/";
	$regexp = "/[^A-Za-z0-9@:;,\\.\\-\\+\\&\\_\\/\\#\\?\\= ]+/";

	// BASE64 Encoded UTF-8 charset allowed to avoid copy-paste encoding error
	$regexp = base64_decode("L1teQS1aYS16MC05QDo7LFwuXC1cK1wmIMOlw6fDoMOiw6HDpMOpw6rDqMOrw6zDrcOuw6/DtMOzw7LDtsO1w7nDusO7w7zDv8Oxw4PDhcOHw4DDgsOBw4TDicOKw4jDi8OMw43DjsOPw5TDk8OSw5bDlcOZw5rDm8Ocw5HCq8K7PD4hQCMkXCVcXlwmXCpcKFwpXFtcXVx7XH1cLVxfPVwrXC9cfDo7LC5cJ2B+wrLCs8K8wr3CvsKuwqlcP10rL2k=");

	$regexpURL = "/[^A-Za-z0-9%!~@:;,\\.\\-\\+\\&\\_\\/\\#\\?\\= ]+/";

	$videoList       = preg_replace($regexp, '', $videoList      );
	$recipientName   = preg_replace($regexp, '', $recipientName  );
	$senderEmail     = preg_replace($regexp, '', $senderEmail    );
	$companyName     = preg_replace($regexp, '', $companyName    );
	$acceptTerms     = preg_replace($regexp, '', $acceptTerms    );
	$imageCompanyLogoUrl = preg_replace($regexpURL, '', $imageCompanyLogoUrl);

	$json = '{"videoList":"'.$videoList
	.'","recipientName":"'.$recipientName
	.'","senderEmail":"'.$senderEmail 
	.'","senderCompanyName":"'.$companyName
	.'","acceptTerms":"'.$acceptTerms 
	.'","imageCompanyLogoUrl":"'.$imageCompanyLogoUrl
	.'"}';

	$json = trim(strval($json));


	$ch =   curl_init();
			$url = "https://individeo.com/individeo/rest/v24/create-video-upload?a=". $attachmentCode ."&lang=en-US";
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_POST,            true);
			curl_setopt($ch, CURLOPT_FRESH_CONNECT  , true);
			curl_setopt($ch, CURLOPT_FORBID_REUSE   , true);
			curl_setopt($ch, CURLOPT_TIMEOUT        , 400);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER , true);

			#curl_setopt($ch, CURLOPT_HEADER         , true);
			#curl_setopt($ch, CURLOPT_VERBOSE        , true);

	$headers = [
		'Accept: application/json',
		'Content-Type: application/json',
		'User-Agent: Mozilla/5.0',

		'username: author@hpg.com',
		'userpass: 2)n5/pD$}rdam^6d'
	];

// user : creator@hpg.com
// pass : 2)n5/pD$}rdam^6d

	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);


	curl_setopt($ch, CURLOPT_POSTFIELDS, $json);

#print_r($ch);

	$server_output = curl_exec ($ch);

	curl_close ($ch);

	@ob_end_clean();

/*
if (strpos($server_output, 'error', 0) != false)
{
	echo "[";
	echo $json;
	echo ",";
	echo $server_output;
	echo "]";
}
else
*/
{
	echo $server_output;
}

	exit;
?>
