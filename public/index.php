<?php
// start a session and store csrf token in it.
@session_start();
$rand = mt_rand(5,19);
$sid = session_id();
#$attachmentCode = "YR9nbT2a2JYy8QjfBw-780" ;
#$attachmentCode = "yHAS3nFQyq4xH88bPh-783";
#$attachmentCode = "PQYfTqQ4BB87UrYwEA-786;

$attachmentCode = "KJMj4SCR2qMwSbwjyEYw-786";

$_SESSION['createVideoRand' ]=$rand;
$_SESSION['createVideoToken']=sha1($sid.$rand);
$_SESSION['createVideoTime' ]=time();

?>

<!DOCTYPE html><html><head>
<meta charset="UTF-8" />
<title>HPG Video+ :: Custom branded video sales tool</title>
<script type="text/javascript">//<!--

	var recipientCode = "";
	var attachmentCode = "<?php echo $attachmentCode;?>" ;
	var xmlhttp;

	//Set Landing Pae URL
	var baseURL = "https://hpgbrands.com/videoplus/player/?a=<?php echo $attachmentCode;?>";

	function createVideo()
	{
		//Get Form Data
		var createVideoForm = document.getElementById("createVideoForm");
		var companyName     = document.getElementById("companyName").value || "";
		var imageCompanyLogoUrl = document.getElementById("imageCompanyLogoUrl").value || "";
		var recipientName   = document.getElementById("recipientName").value || "";
		var senderEmail     = document.getElementById("senderEmail").value || "";
		var videoList       = createVideoForm.elements.namedItem("videoList").value || 0;
		var acceptTerms     = document.getElementById("acceptTerms").checked || 0;

		// Define Service URL
		var url = "./createVideo.php";

		//Open the XHR request
		window.xmlhttp = new XMLHttpRequest();

		//Define XHR Listeners
		xmlhttp.addEventListener('loadstart',   handleEvent);
		xmlhttp.addEventListener('load',        handleEvent);
		xmlhttp.addEventListener('loadend',     handleEvent);
		xmlhttp.addEventListener('progress',    handleEvent);
		xmlhttp.addEventListener('error',       handleEvent);
		xmlhttp.addEventListener('abort',       handleEvent);

		//Define security headers
		xmlhttp.open("POST", url);
		//xmlhttp.setRequestHeader("content-type", "application/json");
		xmlhttp.setRequestHeader("accept",       "application/json");
		xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

		var postdata = "a=<?php echo $attachmentCode;?>&lang=en-US&videoList="
		+ encodeURIComponent(videoList)
		+ "&recipientName="
		+ encodeURIComponent(recipientName)
		+ "&senderEmail="
		+ encodeURIComponent(senderEmail)
		+ "&csrfToken="
		+ encodeURIComponent("<?php echo $_SESSION['createVideoToken']; ?>")
		+ "&companyName="
		+ encodeURIComponent(companyName)
		+ "&acceptTerms="
		+ encodeURIComponent(acceptTerms)
		+ "&imageCompanyLogoUrl="
		+ encodeURIComponent(imageCompanyLogoUrl);

		xmlhttp.send(postdata);
		console.log(postdata);
	}

	function handleEvent(e)
	{
		if(xmlhttp.status >= 200 || xmlhttp.status < 400)
			if(e.type === "loadend")
			{
				console.log(xmlhttp.response) ;

				var responseData = "";
				var errorData = "";
				var dt ;

				if(typeof xmlhttp.response === "string") {
					try {
						responseData = JSON.parse(xmlhttp.response);
					}catch(e){
						dt.status = ERROR_STATUS;
						dt.errorCode = JSON_PARSE_ERROR;
					}
				}

				var indiHtml=document.getElementById("individeo") || {};

				// Clear any existing content
				indiHtml.innerHTML = "" ;

				if (responseData)
				{
					recipientCode       = responseData.recipientCode || "";

					if (recipientCode && recipientCode.length > 3) {

						//console.log(recipientCode) ;

						// Inject Smart Embed Dyanmically
						var individeo = document.createElement("script") ;
						individeo.setAttribute("class", "smartEmbedJavascript") ;
						individeo.setAttribute("type", "text/javascript") ;
						individeo.setAttribute("data-bp-attachment-code", "<?php echo $attachmentCode;?>") ;
						
						individeo.setAttribute("data-bp-recipient-code", recipientCode) ;
						individeo.setAttribute("data-bp-lang", "en-US") ;

						individeo.setAttribute("data-bp-on-ready", "onIndivideoReady") ;
						individeo.setAttribute("src", "https://d2ur3inljr7jwd.cloudfront.net/individeo/prod/edge/js/smartEmbed.js");

						indiHtml.append(individeo) ;
					}
				}
			}
	}

	function onIndivideoReady(smartPlayer)
	{
		//Enable the open Video button
		
		document.getElementById("textAreaCopyBtn").disabled = false;
		var txt = document.getElementById("copyTextArea") || {};
		txt.disabled = false;
		txt.innerHTML = baseURL+ "&r="+recipientCode ;
	}

	function copyTextToClipboard() {
		var copyTextarea = document.getElementById("copyTextArea") || {};
			copyTextarea.focus();
			copyTextarea.select();

		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
		} catch (err) {
			console.log('Oops, unable to copy');
		}
	}

function previewFile(e)
{
//console.log("previewFile(e)",e);
	if (window.FileReader)
	{
		var preview = document.getElementById("imageCompanyLogoImage") || {};
		var file    = document.getElementById("imageCompanyLogoFile") || {};
		var file0   = file.files[0];
		var url     = document.getElementById("imageCompanyLogoUrl") || {};

//console.log("preview", preview);
//console.log("file0", file0);
//console.log("url", url);

		var reader  = new FileReader();
		var img = null;
		reader.addEventListener("load", function () {
			// convert image file to base64 string
			var dataurl = reader.result || "";

			var old = preview.getAttribute("data-old-src") || "";
			if(!old){
				preview.setAttribute("data-old-src", preview.src || "");
			}

			preview.src = dataurl;
			url.value = dataurl;
			img = new Image();
			img.src=dataurl;
			window.img=img;
			img.onload=checkImageDimension;
			checkImageDimension(img);
		}, false);

		if (file0) {
			var filesize = ((+file0.size/1024) || 0).toFixed(4); // MB
			if (filesize > 1024)
			{
				alert("File is too large");
				return resetImage(url,file,preview);
			}

			reader.readAsDataURL(file0);
		}
	}
	else
	{
		alert("No FileReader");
	}
}

function checkImageDimension(e,img)
{
	if (e) { img = img || this; }

                        if (img && img.src)
                        {
                                if (+img.width > 1000 && +img.height > 1000)
                                {
                                        alert("Image is too wide and too high. Maximum dimensions are 1000x1000.");
                                        return resetImage();
                                }
                                else if (+img.width > 1000)
                                {
                                        alert("Image is too wide. 1000 px max width.");
                                        return resetImage();
                                }
                                else if (+img.height > 1000)
                                {
                                        alert("Image is too high. 1000 px max height.");
                                        return resetImage();
                                }
                                else
                                {
                                        console.log("Dimensions are OK : ", +img.width , +img.height);
                                }
                        }
                        else
                        {
                                console.log("No Image found");
                        }

			return true;
}

function resetImage(purl,pfile,ppreview)
{
		var preview = ppreview || document.getElementById("imageCompanyLogoImage") || {};
		var file    = pfile || document.getElementById("imageCompanyLogoFile") || {};
		var url     = purl || document.getElementById("imageCompanyLogoUrl") || {};

                                url.value = "";
                                file.value = null;
                                var old = preview.getAttribute("data-old-src") || "";
                                preview.src = old;
                                return false;
}

function validateTerms()
{
		var acceptTerms = document.getElementById("acceptTerms").checked ;
		
		console.log(acceptTerms) ;

		if (acceptTerms === true) {
			document.getElementById("createVideoBtn").disabled = false ;
		} else {
			document.getElementById("createVideoBtn").disabled = true ;
		}
}

// --></script>


<style type="text/css">
div,label{border:0px solid red}

div.wrapper { display:block;float:none;clear:both; width: 800px; margin:0px auto; padding: 20px 0;}

div.row { display:block;float:left;clear:both; width: 100%; min-height:40px;}

div.wrapper button { display:block;float:left;clear:none; margin: 10px 0; margin-right: 10px; }

form div.row label { display:block;float:left;clear:none; width: 220px; padding-top:20px;}
form div.row label.disclaimer { display:block;float:left;clear:none; width: 30px; }

div.row img { display:block; float:left; clear:none; width: 300px;}

div.row input { display:block; float:left; clear:none; width: 330px;}

div.row textarea    { display:block; float:left; clear:none; width: 100%; height:5em; padding: 20px 0; }

form select { display:block;float:left;clear:none; width: 330px;}
form input  { display:block;float:left;clear:none; width: 300px;}
	body {
			font-family:Gotham, 'Helvetica Neue', Helvetica, Arial, 'sans-serif';
			margin: 0 auto;
			font-size: 15px;
			line-height: 25px;
		}
		input {
			padding: 10px; 
			width: 100%; 
			margin: 0 0 30px 0; 
			border:0; 
			border-bottom: solid 1px #cccccc;
			font-size: 18px;
		}
		#header {
			background-color: #000000; 
			padding: 30px 0 10px 0;
			text-align: center;
		}
		#nav {
			background-color: #111111; 
			padding: 20px 0 11px 0;
			text-align: center;
			margin-bottom: 50px;
			color: #ffffff;
			visibility: hidden;
		}
		#content {
			max-width: 680px;
			margin: 0 auto;
			padding: 0px;
			clear: both;
			display:block;float:none;
		}
		select {
			height: 50px;
			border:0; 
			border-bottom: solid 1px #cccccc;
			font-size: 18px;
			background-color: #f1f1f1;
			border-radius: 0px;
			text-shadow: none;
			display: inline-block;
			font-family: 'Helvetica Neue', Helvetica, Arial, 'sans-serif';
			width:100%;
			padding: 10px;
			margin-top: 10px;
			}
		button,input[type=button],input[type=submit] {
			background-color: #1e22aa;
			border: 0;
			padding:15px 0;
			font-size: 18px;
			border-radius: 0;
			color: #ffffff;
			width: 100%;
			margin-top: 10px;
			font-weight: 500;
			letter-spacing: 5px;
		}
		#footer {
			background-color: #000000; 
			padding: 30px;
			text-align: center;
			color: #ffffff;
			margin-top: 50px;
			clear: both;
			float: left;
			width: 100%;
			padding-bottom: 50px;
		}
		#copyTextArea { width: 550px; float: left; height: 10px; margin-top:30px; font-family: Gotham, "Helvetica Neue", Helvetica, Arial, "sans-serif"; }
		button#textAreaCopyBtn { display:block;float:left;clear:none; width: 200px; margin-top:30px; }
		#footer a {
			color: #ffffff;
			text-decoration: none;
		}
	div.disc {
		width: 100%;
		float: left;
		clear: both;
		padding: 100px 0 0 0;
		font-size: 10px;
	}
	div.approve {
		float: left;
		padding: 30px 0;
	}
	div.approve a {display: inline-block;}
	#individeo {clear: both;}
	div.hide {visibility: hidden;}
	.bp-signature-container .bp-signature-logo {
		visibility: hidden;
	}
</style>
</head>
<body>
<div id="header"><img src="https://hpgbrands.com/wp-content/uploads/2019/11/hpg_logo_white.png" alt="HPG logo" width="100px" /></div>
	<div id="nav"><a href="https://customhpg.com" style="color: #ffffff; text-decoration: none; display: inline-block;">CATALOG+</a> &nbsp;&nbsp;&nbsp;&nbsp;VIDEO+</div>
<div class="wrapper">
	
	<h1 align="center">Customize your own video</h1>
	<p align="center">Upload a logo and complete the form below to instantly populate your own custom video. You will blow your customers away, try for yourself.</p><p align="center">Note: Logo's must be in PNG format for the best effect and no larger than 1000x1000 pixels.</p>
	<hr /><br /><br />
	
	<form id = "createVideoForm" name = "createVideoForm" action="?" onsubmit="false">

		<div class="row"><label for="companyName"  >Company Name :     </label><input
			type="text" id="companyName" name="companyName" maxlength="255"
		/><br /><br /></div>

		<div class="row"><label for="imageCompanyLogoFile"  >Company Logo File :   </label><input 
			accept="image/png, image/gif"
			type="file" id="imageCompanyLogoFile" name="imageCompanyLogoFile"
			onchange="previewFile()"
			onblur="previewFile()"
		/><br /><br /></div>

		<div class="row" id="imageCompanyLogoUrlPreview">
			<label for="imageCompanyLogoImage"> Company Logo Preview : </label>
			<img id="imageCompanyLogoImage" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
				border="0" width="1000" height="1000" alt="Image Preview" 
				style="max-width:1000px;max-height:1000px;width:auto;height:auto;border:1px solid black; background-color:#f1f1f1;" /><br /><br />
		</div>

		<div class="row"><label for="recipientName">Recipient Name :   </label><input
			type="text" id="recipientName" name="recipientName" maxlength="255"
		/><br /><br /></div>

		<div class="row"><label for="senderEmail"  >Sender Email :     </label><input
			type="text" id="senderEmail" name="senderEmail" maxlength="255"
		/><br /><br /></div>

		<div class="row"><label for="videoList">Select Video :       </label><select id="videoList" name="videoList">
			<option value="video1">Sustainable Products</option>
			<option value="video2">New PPE</option>
			<option value="video3">New Food Kits / Batch &amp; Bodega</option>
			<option value="video4">Personalize It</option>
			<option value="video5">Top-shelf Gifts</option>
			<option value="video6">Health and Wellness</option>
			<option value="video8">New Full Color Options</option>
			<option value="video12">Low Cost Giveaways</option>
			<option value="video9">Best of Tech '21</option>
			<option value="video10">Emblematics / BCG Creations</option>
			<option value="video7">New at Beacon</option>
			<option value="video13">New at BEST Promotions</option>
			<option value="video14">New at Debco (CANADA)</option>
			<option value="video15">New at Handstands</option>
			<option value="video16">New at Hub</option>
			<option value="video11">New at Origaudio</option>
			<option value="video17">New at Webb Company</option>
		</select><br /><br /></div>

		<div class="approve">
		<label class="disclaimer">I accept the <a href="#terms">terms and conditions</a>
		  <input id="acceptTerms" name="acceptTerms" onClick="validateTerms()" type="checkbox" value="true" style="width: 30px;" />
		</label>
		</div>
		
				<div class="hide"><label for="imageCompanyLogoUrl"  >Company Logo URL :     </label><input
			type="text" id="imageCompanyLogoUrl" name="imageCompanyLogoUrl" maxlength="2000000"
		/><br /><br /></div>

	</form>
		<div class="block">
		<button id="createVideoBtn" onClick="createVideo()" type="button" disabled="disabled">Create Video</button>
	</div>
	<br /><br />
		<div class="individeoBlock">
		
			<div id = "individeo">
				&nbsp;
			</div>
		
		
	</div>
	<div class="block">
		<div class="row">
			<textarea class="copyTextArea" id="copyTextArea" disabled="disabled"></textarea>
			<button onClick="copyTextToClipboard()" class="textAreaCopyBtn" id="textAreaCopyBtn" disabled="disabled">Copy Link</button>
		</div>
	</div>

		<a name="terms">
		<div class="disc">
		<h2>Terms of Use and Disclaimer</h2>
<p>
As a user of this service (the ???Service???) provided by BlueRush Digital Media Corp. (???BlueRush???) you agree to the following terms (the ???Terms???):
</p><p>
1. Use this Service AT YOUR OWN RISK.
</p><p>
2. As between the Service and you, you exclusively own all right, title and interest in and to all of your data which you upload to the Service (???Your Content???).
</p><p>
3. You shall: (i) have sole responsibility for the accuracy, quality, integrity, legality, reliability, and appropriateness of all of Your Content which you may upload to the Service;
</p><p>
4. You shall not: (i) use the Service to send spam or otherwise duplicative or unsolicited messages in violation of applicable laws; (ii) use the Service to send or store infringing, obscene, threatening, libelous, or otherwise unlawful or tortious material, including material that is harmful to children or violates third-party privacy or publicity rights; (iii) use the Service to send or store malicious code; (iv) interfere with or disrupt the integrity or performance of the Service or the data contained therein; or (v) attempt to gain unauthorized access to the Service or any related systems or networks.
</p><p>
5. You understand that you are solely responsible for Your Content that you post on or through the Service. You represent that you have all necessary rights to Your Content, including all necessary rights to post it or use it on the Service.
</p><p>
6. You represent that you???re not infringing or violating any third party???s rights by posting Your Content or using Your Content on the Service.
</p><p>
7. You must respect the work and creative rights of others. You must either own Your Content which you post on the Service, or have the express authority to post it. Your Content must comply with right of publicity, trademark and copyright laws, and all other applicable laws.
</p><p>
8. We are committed to following appropriate legal procedures to remove infringing content from the Service. BlueRush will try to accommodate and not interfere with standard technical measures used by copyright/trademark owners to identify and protect their works.
</p><p>
9. BlueRush reserves the right to do any or all of the following at any time at our sole discretion: (i) immediately suspend your use of the Service; and/or (ii) remove, block, and disable access to any of Your Content that is alleged to infringe the intellectual property rights of others. When we receive proper notice of intellectual property infringement (via email or otherwise), BlueRush strives to respond quickly by removing, blocking, or disabling access to the allegedly infringing material.
</p><p>
10. When BlueRush removes, blocks or disables access in response to such a notice, BlueRush makes a reasonable attempt to contact the allegedly infringing party, provide information about the notice and removal, and, in cases of alleged copyright infringement, provide information about counter notification.
</p><p>
DISCLAIMER: By pressing the create button and proceeding to use the Service you acknowledge and agree that:
</p><p>
a. ACCESS TO AND USE OF THE SERVICE IS ON AN ???AS-IS??? BASIS WITHOUT ANY REPRESENTATIONS, WARRANTIES AND/OR CONDITIONS OF ANY KIND.
</p><p>
b. TO THE FULLEST EXTENT PERMITTED BY LAW, WE ARE EXPRESSLY DISCLAIMING ANY AND ALL WARRANTIES OR CONDITIONS OF NON-
</p><p>
INFRINGEMENT, MERCHANTABILITY, AND FITNESS FOR A PARTICULAR PURPOSE, AS WELL AS ANY WARRANTIES OR CONDITIONS IMPLIED BY A COURSE OF PERFORMANCE, COURSE OF DEALING, OR USAGE OF TRADE, WITH RESPECT TO THE SERVICE. SOME JURISDICTIONS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR CONDITIONS, SO THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU.
</p><p>
c. Any reliance on the Service is solely at your own risk; and
</p><p>
d. You shall, on demand from BlueRush, indemnify, defend and hold, its affiliates and its and their directors, officers, employees, contractors and agents (the ???BlueRush Indemnitees???) harmless from and against any and all damages, liability and costs, including but not limited to fines, penalties, and attorneys??? fees, incurred by any of the BlueRush Indemnitees in connection with or arising out of: (i) Your violation or breach of these Terms or any applicable law or regulation, whether or not referenced in these Terms; (ii) Your violation of any rights of any third party; (iii) Your misuse of the Service; or (iv) Your Content.
</p><p>
LIMITATION OF LIABILITY: TO THE FULLEST EXTENT PERMITTED BY LAW, NEITHER BLUERUSH NOR ANY OTHER BLUERUSH PARTY SHALL BE LIABLE TO YOU OR YOUR CUSTOMERS FOR ANY LOST PROFITS OR REVENUES, DIMINUTION IN VALUE, OR FOR ANY CONSEQUENTIAL, INCIDENTAL, INDIRECT, SPECIAL, EXEMPLARY, ENHANCED, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO THE SERVICE OR THIS AGREEMENT, REGARDLESS OF (I) WHETHER ANY OF THE FOREGOING DAMAGES WERE FORESEEABLE, (II) WHETHER OR NOT YOU WERE ADVISED OF THE POSSIBILITY OF INCURRING ANY OF THE FOREGOING DAMAGES, (III) THE LEGAL OR EQUITABLE THEORY (CONTRACT, TORT, OR OTHERWISE) UPON WHICH THE CLAIM IS BASED, AND (IV) ANY SPECIFIC CIRCUMSTANCES OF YOU AND/OR YOUR CUSTOMER. THE LIABILITY OF THE BLUERUSH PARTIES WILL UNDER NO CIRCUMSTANCES EXCEED THE ACTUAL AMOUNT PAID BY YOU FOR THE SERVICE THAT YOU HAVE PURCHASED OR USED THROUGH THE SITE. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF INCIDENTAL, CONSEQUENTIAL OR CERTAIN OTHER DAMAGES, SO THE ABOVE LIMITATIONS AND EXCLUSIONS MAY NOT APPLY TO YOU.
</p><p>
BY ACCEPTING THESE TERMS BY CLICKING A BOX INDICATING YOUR ACCEPTANCE OF THESE TERMS, OR BY USING THE SERVICE, YOU INDICATE YOUR ACCEPTANCE OF THESE TERMS. IF YOU DO NOT ACCEPT THESE TERMS, THEN YOU MAY NOT USE THE SERVICE.
			</p>
			<br /></div></div>
</div>
		<div id="footer"><a href="https://hpgbrands.com"><< Back to HPG Brands Website</a></div>
</body>
</html>
