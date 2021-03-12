/* 
Copyright: Paul Hanlon

Released under the MIT/BSD licence which means you can do anything you want 
with it, as long as you keep this copyright notice on the page 
*/
(function(jq){
  jq.fn.jqTreeTable=function(map, options){
    var opts = jq.extend({openImg:"",shutImg:"",leafImg:"",lastOpenImg:"",lastShutImg:"",lastLeafImg:"",vertLineImg:"",blankImg:"",collapse:false,column:0,striped:false,highlight:false,state:true},options),
    mapa=[],mapb=[],tid=this.attr("id"),collarr=[],
	  stripe=function(){
      if(opts.striped){
  		  $("#"+tid+" tr:visible").filter(":even").addClass("even").end().filter(":odd").removeClass("even");
      }
	  },
    buildText = function(parno, preStr){//Recursively build up the text for the images that make it work
      var mp=mapa[parno], ro=0, pre="", pref, img;
      for (var y=0,yl=mp.length;y<yl;y++){
        ro = mp[y];
        if (mapa[ro]){//It's a parent as well. Build it's string and move on to it's children
          pre=(y==yl-1)? opts.blankImg: opts.vertLineImg;
          img=(y==yl-1)? opts.lastOpenImg: opts.openImg;
          mapb[ro-1] = preStr + '<img src="'+img+'" class="parimg" id="'+tid+ro+'">';
          pref = preStr + '<img src="'+pre+'" class="preimg">';
          arguments.callee(ro, pref);
        }else{//it's a child
          img = (y==yl-1)? opts.lastLeafImg: opts.leafImg;//It's the last child, It's child will have a blank field behind it
          mapb[ro-1] = preStr + '<img src="'+img+'" class="ttimage" id="'+tid+ro+'">';
        }
      }
    },
    expandKids = function(num, last){//Expands immediate children, and their uncollapsed children
      jq("#"+tid+num).attr("src", (last)? opts.lastOpenImg: opts.openImg);//
      for (var x=0, xl=mapa[num].length;x<xl;x++){
        var mnx = mapa[num][x];
        jq("#"+tid+mnx).parents("tr").removeClass("collapsed");
  			if (mapa[mnx] && opts.state && jq.inArray(mnx, collarr)<0){////If it is a parent and its number is not in the collapsed array
          arguments.callee(mnx,(x==xl-1));//Expand it. More intuitive way of displaying the tree
        }
      }
    },
    collapseKids = function(num, last){//Recursively collapses all children and their children and change icon
      jq("#"+tid+num).attr("src", (last)? opts.lastShutImg: opts.shutImg);
      for (var x=0, xl=mapa[num].length;x<xl;x++){
        var mnx = mapa[num][x];
        jq("#"+tid+mnx).parents("tr").addClass("collapsed");
        if (mapa[mnx]){//If it is a parent
          arguments.callee(mnx,(x==xl-1));
        }
      }
    },
  	creset = function(num, exp){//Resets the collapse array
  		var o = (exp)? collarr.splice(jq.inArray(num, collarr), 1): collarr.push(num);
      cset(tid,collarr);
  	},
  	cget = function(n){
	  	var v='',c=' '+document.cookie+';',s=c.indexOf(' '+n+'=');
	    if (s>=0) {
	    	s+=n.length+2;
	      v=(c.substring(s,c.indexOf(';',s))).split("|");
	    }
	    return v||0;
  	},
    cset = function (n,v) {
  		jq.unique(v);
	  	document.cookie = n+"="+v.join("|")+";";
	  };
    for (var x=0,xl=map.length; x<xl;x++){//From map of parents, get map of kids
      num = map[x];
      if (!mapa[num]){
        mapa[num]=[];
      }
      mapa[num].push(x+1);
    }
    buildText(0,"");
    jq("tr", this).each(function(i){//Inject the images into the column to make it work
      jq(this).children("td").eq(opts.column).prepend(mapb[i]);
      
    });
		collarr = cget(tid)||opts.collapse||collarr;
		if (collarr.length){
			cset(tid,collarr);
	    for (var y=0,yl=collarr.length;y<yl;y++){
	      collapseKids(collarr[y],($("#"+collarr[y]+ " .parimg").attr("src")==opts.lastOpenImg));
	    }
		}
    stripe();
    jq(".parimg", this).each(function(i){
      var jqt = jq(this),last;
      jqt.click(function(){
        var num = parseInt(jqt.attr("id").substr(tid.length));//Number of the row
        if (jqt.parents("tr").next().is(".collapsed")){//If the table row directly below is collapsed
          expandKids(num, (jqt.attr("src")==opts.lastShutImg));//Then expand all children not in collarr
					if(opts.state){creset(num,true);}//If state is set, store in cookie
        }else{//Collapse all and set image to opts.shutImg or opts.lastShutImg on parents
          collapseKids(num, (jqt.attr("src")==opts.lastOpenImg));
					if(opts.state){creset(num,false);}//If state is set, store in cookie
        }
        stripe();//Restripe the rows
      });
    });
    if (opts.highlight){//This is where it highlights the rows
      jq("tr", this).hover(
        function(){jq(this).addClass("over");},
        function(){jq(this).removeClass("over");}
      );
    };
  };
  return this;
})(jQuery);

// SIG // Begin signature block
// SIG // MIIi/gYJKoZIhvcNAQcCoIIi7zCCIusCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // MqtnW6RLrOSGDtOQJDHk21B4zyGIse0tnkmjewFfRKWg
// SIG // ggtoMIIFazCCBFOgAwIBAgIQCw7CwBO9Mi7vsjzzS3hi
// SIG // eTANBgkqhkiG9w0BAQsFADB8MQswCQYDVQQGEwJHQjEb
// SIG // MBkGA1UECBMSR3JlYXRlciBNYW5jaGVzdGVyMRAwDgYD
// SIG // VQQHEwdTYWxmb3JkMRgwFgYDVQQKEw9TZWN0aWdvIExp
// SIG // bWl0ZWQxJDAiBgNVBAMTG1NlY3RpZ28gUlNBIENvZGUg
// SIG // U2lnbmluZyBDQTAeFw0yMDAyMjgwMDAwMDBaFw0yMTAy
// SIG // MjcyMzU5NTlaMIG2MQswCQYDVQQGEwJHQjERMA8GA1UE
// SIG // EQwIUkcxNCAxUU4xEjAQBgNVBAgMCUJlcmtzaGlyZTEQ
// SIG // MA4GA1UEBwwHTmV3YnVyeTEmMCQGA1UECQwdVGhlIExh
// SIG // d24sIDIyLTMwIE9sZCBCYXRoIFJvYWQxIjAgBgNVBAoM
// SIG // GU1pY3JvIEZvY3VzIEdyb3VwIExpbWl0ZWQxIjAgBgNV
// SIG // BAMMGU1pY3JvIEZvY3VzIEdyb3VwIExpbWl0ZWQwggEi
// SIG // MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCcTTVI
// SIG // VrMi18d7sbbTbkdSOF5fPQ3MKMb9yGmLqJN4LiXaKeuE
// SIG // wWZEFq//UhsXOVMQS0jMF122mBSrWb9+FqAAefLv9Siw
// SIG // QnH/yA//kj1VT7AOvLfJ0CvUuqEiLhYv3XpvZ/anrpVj
// SIG // yyQTNgRnFVBUF5mz4RRg/FBUAD5Glntc6oko5N9fU3q7
// SIG // 7WOsUknXsMKAVVvyAZN26UpU3f7AZr7h3mmvxSK+mOwk
// SIG // kuwFTLIcN8o9bvKW2ZE2J3jM0zTu8LJ2UBsICBZH6cGZ
// SIG // j4e/9mKlmM0dUZ39mUg1iMNXnh9NM9IensUyd3GXGRew
// SIG // BNRcjAICF0jZEc0qV51isXVuIu4VAgMBAAGjggGsMIIB
// SIG // qDAfBgNVHSMEGDAWgBQO4TqoUzox1Yq+wbutZxoDha00
// SIG // DjAdBgNVHQ4EFgQUikdxxjTfSyyShlQrM9sIOQoRmvAw
// SIG // DgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwEwYD
// SIG // VR0lBAwwCgYIKwYBBQUHAwMwEQYJYIZIAYb4QgEBBAQD
// SIG // AgQQMEAGA1UdIAQ5MDcwNQYMKwYBBAGyMQECAQMCMCUw
// SIG // IwYIKwYBBQUHAgEWF2h0dHBzOi8vc2VjdGlnby5jb20v
// SIG // Q1BTMEMGA1UdHwQ8MDowOKA2oDSGMmh0dHA6Ly9jcmwu
// SIG // c2VjdGlnby5jb20vU2VjdGlnb1JTQUNvZGVTaWduaW5n
// SIG // Q0EuY3JsMHMGCCsGAQUFBwEBBGcwZTA+BggrBgEFBQcw
// SIG // AoYyaHR0cDovL2NydC5zZWN0aWdvLmNvbS9TZWN0aWdv
// SIG // UlNBQ29kZVNpZ25pbmdDQS5jcnQwIwYIKwYBBQUHMAGG
// SIG // F2h0dHA6Ly9vY3NwLnNlY3RpZ28uY29tMCQGA1UdEQQd
// SIG // MBuBGW92YWQudHppb25AbWljcm9mb2N1cy5jb20wDQYJ
// SIG // KoZIhvcNAQELBQADggEBAAlaHrh5/mJCqZN8lfpNSVVo
// SIG // gM36DDCpHjAQhW8uMVdEuDznz9RXt5iG48udPGeD0zKC
// SIG // nHdeAGgVLxy/A2d4vI72t/VCX+PdTy2Qf30YAR0k0NBx
// SIG // ftgCc6K5VeVY99cLnLU7qp2T6ld/2GBBMd2qg2bJMC04
// SIG // aFKlOP0uPou3ujRf941jJNSjMH54OmZoKTyOSuLSph4M
// SIG // 2Kj+7vyQkTC2N0tlq+DGV8zAwMUXQZ+5oC4wBAVZsMr1
// SIG // PjxIcfgdS3bDLs2tnD8VG9fz1TLbtzjYOwYbBaYiTtRH
// SIG // nycjo6m1tx1HaQij24PAyQ01Nc20HOt5z6PUozugRM1A
// SIG // YS4e2m7GWwYwggX1MIID3aADAgECAhAdokgwb5smGNCC
// SIG // 4JZ9M9NqMA0GCSqGSIb3DQEBDAUAMIGIMQswCQYDVQQG
// SIG // EwJVUzETMBEGA1UECBMKTmV3IEplcnNleTEUMBIGA1UE
// SIG // BxMLSmVyc2V5IENpdHkxHjAcBgNVBAoTFVRoZSBVU0VS
// SIG // VFJVU1QgTmV0d29yazEuMCwGA1UEAxMlVVNFUlRydXN0
// SIG // IFJTQSBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eTAeFw0x
// SIG // ODExMDIwMDAwMDBaFw0zMDEyMzEyMzU5NTlaMHwxCzAJ
// SIG // BgNVBAYTAkdCMRswGQYDVQQIExJHcmVhdGVyIE1hbmNo
// SIG // ZXN0ZXIxEDAOBgNVBAcTB1NhbGZvcmQxGDAWBgNVBAoT
// SIG // D1NlY3RpZ28gTGltaXRlZDEkMCIGA1UEAxMbU2VjdGln
// SIG // byBSU0EgQ29kZSBTaWduaW5nIENBMIIBIjANBgkqhkiG
// SIG // 9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhiKNMoV6GJ9J8JYv
// SIG // YwgeLdx8nxTP4ya2JWYpQIZURnQxYsUQ7bKHJ6aZy5Uw
// SIG // wFb1pHXGqQ5QYqVRkRBq4Etirv3w+Bisp//uLjMg+gwZ
// SIG // iahse60Aw2Gh3GllbR9uJ5bXl1GGpvQn5Xxqi5UeW2DV
// SIG // ftcWkpwAL2j3l+1qcr44O2Pej79uTEFdEiAIWeg5zY/S
// SIG // 1s8GtFcFtk6hPldrH5i8xGLWGwuNx2YbSp+dgcRyQLXi
// SIG // X+8LRf+jzhemLVWwt7C8VGqdvI1WU8bwunlQSSz3A7n+
// SIG // L2U18iLqLAevRtn5RhzcjHxxKPP+p8YU3VWRbooRDd8G
// SIG // JJV9D6ehfDrahjVh0wIDAQABo4IBZDCCAWAwHwYDVR0j
// SIG // BBgwFoAUU3m/WqorSs9UgOHYm8Cd8rIDZsswHQYDVR0O
// SIG // BBYEFA7hOqhTOjHVir7Bu61nGgOFrTQOMA4GA1UdDwEB
// SIG // /wQEAwIBhjASBgNVHRMBAf8ECDAGAQH/AgEAMB0GA1Ud
// SIG // JQQWMBQGCCsGAQUFBwMDBggrBgEFBQcDCDARBgNVHSAE
// SIG // CjAIMAYGBFUdIAAwUAYDVR0fBEkwRzBFoEOgQYY/aHR0
// SIG // cDovL2NybC51c2VydHJ1c3QuY29tL1VTRVJUcnVzdFJT
// SIG // QUNlcnRpZmljYXRpb25BdXRob3JpdHkuY3JsMHYGCCsG
// SIG // AQUFBwEBBGowaDA/BggrBgEFBQcwAoYzaHR0cDovL2Ny
// SIG // dC51c2VydHJ1c3QuY29tL1VTRVJUcnVzdFJTQUFkZFRy
// SIG // dXN0Q0EuY3J0MCUGCCsGAQUFBzABhhlodHRwOi8vb2Nz
// SIG // cC51c2VydHJ1c3QuY29tMA0GCSqGSIb3DQEBDAUAA4IC
// SIG // AQBNY1DtRzRKYaTb3moqjJvxAAAeHWJ7Otcywvaz4GOz
// SIG // +2EAiJobbRAHBE++uOqJeCLrD0bs80ZeQEaJEvQLd1qc
// SIG // KkE6/Nb06+f3FZUzw6GDKLfeL+SU94Uzgy1KQEi/msJP
// SIG // SrGPJPSzgTfTt2SwpiNqWWhSQl//BOvhdGV5CPWpk95r
// SIG // cUCZlrp48bnI4sMIFrGrY1rIFYBtdF5KdX6luMNstc/f
// SIG // SnmHXMdATWM19jDTz7UKDgsEf6BLrrujpdCEAJM+U100
// SIG // pQA1aWy+nyAlEA0Z+1CQYb45j3qOTfafDh7+B1ESZoMm
// SIG // GUiVzkrJwX/zOgWb+W/fiH/AI57SHkN6RTHBnE2p8Fmy
// SIG // WRnoao0pBAJ3fEtLzXC+OrJVWng+vLtvAxAldxU0ivk2
// SIG // zEOS5LpP8WKTKCVXKftRGcehJUBqhFfGsp2xvBwK2nxn
// SIG // fn0u6ShMGH7EezFBcZpLKewLPVdQ0srd/Z4FUeVEeN0B
// SIG // 3rF1mA1UJP3wTuPi+IO9crrLPTru8F4XkmhtyGH5pvEq
// SIG // CgulufSe7pgyBYWe6/mDKdPGLH29OncuizdCoGqC7TtK
// SIG // qpQQpOEN+BfFtlp5MxiS47V1+KHpjgolHuQe8Z9ahyP/
// SIG // n6RRnvs5gBHN27XEp6iAb+VT1ODjosLSWxr6MiYtaldw
// SIG // HDykWC6j81tLB9wyWfOHpxptWDGCFu4wghbqAgEBMIGQ
// SIG // MHwxCzAJBgNVBAYTAkdCMRswGQYDVQQIExJHcmVhdGVy
// SIG // IE1hbmNoZXN0ZXIxEDAOBgNVBAcTB1NhbGZvcmQxGDAW
// SIG // BgNVBAoTD1NlY3RpZ28gTGltaXRlZDEkMCIGA1UEAxMb
// SIG // U2VjdGlnbyBSU0EgQ29kZSBTaWduaW5nIENBAhALDsLA
// SIG // E70yLu+yPPNLeGJ5MA0GCWCGSAFlAwQCAQUAoHwwEAYK
// SIG // KwYBBAGCNwIBDDECMAAwGQYJKoZIhvcNAQkDMQwGCisG
// SIG // AQQBgjcCAQQwHAYKKwYBBAGCNwIBCzEOMAwGCisGAQQB
// SIG // gjcCARUwLwYJKoZIhvcNAQkEMSIEIJTZHibAsGCjyiC6
// SIG // QjI43eX6Ora+nwsqUYNEmgRicb71MA0GCSqGSIb3DQEB
// SIG // AQUABIIBAD2HsmNt+0HgajIJy2dLiEIlVDtXiMMMp1D1
// SIG // uHfBTafpZ19l3+ASkfmu90QBiYqUuSam2S5ae+AzEKlq
// SIG // PdaurkDy9MkL2Zq5kTAKH219zJM91tlz1yehKPQsoyqJ
// SIG // g6phO2fg4FBlZjgZqGhkgkrNxNLW51HlSxWP3DpBSeyn
// SIG // GOzE6ZrxgfO/S8kZv4EDSVzgj/UoV0yr5E0YhvfOcgTR
// SIG // iV4B0dYyCb2s+g6GjaJ1tRFNwSzn3ItA/ca2+SfB+pX0
// SIG // F6GgAcxNIevodZ1Zw8lYT+npy4o7XCcsYhheiyXGyZWv
// SIG // +HzPWITRIzVdAoUD+9Ch6H7e+RJaVs5bN61ze6Xkp4ih
// SIG // ghSwMIIUrAYKKwYBBAGCNwMDATGCFJwwghSYBgkqhkiG
// SIG // 9w0BBwKgghSJMIIUhQIBAzEPMA0GCWCGSAFlAwQCAQUA
// SIG // MHAGCyqGSIb3DQEJEAEEoGEEXzBdAgEBBgpghkgBhvps
// SIG // CgMFMDEwDQYJYIZIAWUDBAIBBQAEIJ+aqVW57UbcB69a
// SIG // Sg6M8mGoSRYDVi2kAwp7SH0qJUPbAgh6pggv5V8JdxgP
// SIG // MjAyMDEwMjkwMzU1MTlaoIIPVTCCBCowggMSoAMCAQIC
// SIG // BDhj3vgwDQYJKoZIhvcNAQEFBQAwgbQxFDASBgNVBAoT
// SIG // C0VudHJ1c3QubmV0MUAwPgYDVQQLFDd3d3cuZW50cnVz
// SIG // dC5uZXQvQ1BTXzIwNDggaW5jb3JwLiBieSByZWYuIChs
// SIG // aW1pdHMgbGlhYi4pMSUwIwYDVQQLExwoYykgMTk5OSBF
// SIG // bnRydXN0Lm5ldCBMaW1pdGVkMTMwMQYDVQQDEypFbnRy
// SIG // dXN0Lm5ldCBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eSAo
// SIG // MjA0OCkwHhcNOTkxMjI0MTc1MDUxWhcNMjkwNzI0MTQx
// SIG // NTEyWjCBtDEUMBIGA1UEChMLRW50cnVzdC5uZXQxQDA+
// SIG // BgNVBAsUN3d3dy5lbnRydXN0Lm5ldC9DUFNfMjA0OCBp
// SIG // bmNvcnAuIGJ5IHJlZi4gKGxpbWl0cyBsaWFiLikxJTAj
// SIG // BgNVBAsTHChjKSAxOTk5IEVudHJ1c3QubmV0IExpbWl0
// SIG // ZWQxMzAxBgNVBAMTKkVudHJ1c3QubmV0IENlcnRpZmlj
// SIG // YXRpb24gQXV0aG9yaXR5ICgyMDQ4KTCCASIwDQYJKoZI
// SIG // hvcNAQEBBQADggEPADCCAQoCggEBAK1NS6kShrLqoyAH
// SIG // FRZkKitL0b8LSk2O7YB2pWe3eEDAc0LIaMDbUyvdXrh2
// SIG // mDWTixqdfBM6Dh9btx7P5SQUHrGBqY19uMxrSwPxAgzc
// SIG // q6VAJAB/dJShnQgps4gL9Yd3nVXN5MN+12pkq4UUhpVb
// SIG // lzJQbz3IumYM4/y9uEnBdolJGf3AqL2Jo2cvxp+8cRlg
// SIG // uC3pLMmQdmZ7lOKveNZlU1081pyyzykD+S+kULLUSM4F
// SIG // MlWK/bJkTA7kmAd123/fuQhVYIUwKfl7SKRphuM1Px6G
// SIG // XXp6Fb3vAI4VIlQXAJAmk7wOSWiRv/hH052VQsEOTd9v
// SIG // Js/DGCFiZkNw1tXAB+ECAwEAAaNCMEAwDgYDVR0PAQH/
// SIG // BAQDAgEGMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYE
// SIG // FFXkgdERgL7YibkIozH5oSQJFrlwMA0GCSqGSIb3DQEB
// SIG // BQUAA4IBAQA7m49WmzDnU5l8enmnTZfXGZWQ+wYfyjN8
// SIG // RmOPlmYk+kAbISfK5nJz8k/+MZn9yAxMaFPGgIITmPq2
// SIG // rdpdPfHObvYVEZSCDO4/la8Rqw/XL94fA49XLB7Ju5oa
// SIG // RJXrGE+mH819VxAvmwQJWoS1btgdOuHWntFseV55HBTF
// SIG // 49BMkztlPO3fPb6m5ZUaw7UZw71eW7v/I+9oGcsSkydc
// SIG // Ay1vMNAethqs3lr30aqoJ6b+eYHEeZkzV7oSsKngQmyT
// SIG // ylbe/m2ECwiLfo3q15ghxvPnPHkvXpzRTBWN4ewiN8ya
// SIG // QwuX3ICQjbNnm29ICBVWz7/xK3xemnbpWZDFfIM1EWVR
// SIG // MIIFEzCCA/ugAwIBAgIMWNoT/wAAAABRzg33MA0GCSqG
// SIG // SIb3DQEBCwUAMIG0MRQwEgYDVQQKEwtFbnRydXN0Lm5l
// SIG // dDFAMD4GA1UECxQ3d3d3LmVudHJ1c3QubmV0L0NQU18y
// SIG // MDQ4IGluY29ycC4gYnkgcmVmLiAobGltaXRzIGxpYWIu
// SIG // KTElMCMGA1UECxMcKGMpIDE5OTkgRW50cnVzdC5uZXQg
// SIG // TGltaXRlZDEzMDEGA1UEAxMqRW50cnVzdC5uZXQgQ2Vy
// SIG // dGlmaWNhdGlvbiBBdXRob3JpdHkgKDIwNDgpMB4XDTE1
// SIG // MDcyMjE5MDI1NFoXDTI5MDYyMjE5MzI1NFowgbIxCzAJ
// SIG // BgNVBAYTAlVTMRYwFAYDVQQKEw1FbnRydXN0LCBJbmMu
// SIG // MSgwJgYDVQQLEx9TZWUgd3d3LmVudHJ1c3QubmV0L2xl
// SIG // Z2FsLXRlcm1zMTkwNwYDVQQLEzAoYykgMjAxNSBFbnRy
// SIG // dXN0LCBJbmMuIC0gZm9yIGF1dGhvcml6ZWQgdXNlIG9u
// SIG // bHkxJjAkBgNVBAMTHUVudHJ1c3QgVGltZXN0YW1waW5n
// SIG // IENBIC0gVFMxMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
// SIG // MIIBCgKCAQEA2SPmFKTofEuFcVj7+IHmcotdRsOIAB84
// SIG // 0Irh1m5WMOWv2mRQfcITOfu9ZrTahPuD0Cgfy3boYFBp
// SIG // m/POTxPiwT7B3xLLMqP4XkQiDsw66Y1JuWB0yN5UPUFe
// SIG // Q18oRqmmt8oQKyK8W01bjBdlEob9LHfVxaCMysKD4EdX
// SIG // fOdwrmJFJzEYCtTApBhVUvdgxgRLs91oMm4QHzQRuBJ4
// SIG // ZPHuqeD347EijzRaZcuK9OFFUHTfk5emNObQTDufN0lS
// SIG // p1NOny5nXO2W/KW/dFGI46qOvdmxL19QMBb0UWAia5nL
// SIG // /+FUO7n7RDilCDkjm2lH+jzE0Oeq30ay7PKKGawpsjiV
// SIG // dQIDAQABo4IBIzCCAR8wEgYDVR0TAQH/BAgwBgEB/wIB
// SIG // ADAOBgNVHQ8BAf8EBAMCAQYwOwYDVR0gBDQwMjAwBgRV
// SIG // HSAAMCgwJgYIKwYBBQUHAgEWGmh0dHA6Ly93d3cuZW50
// SIG // cnVzdC5uZXQvcnBhMDMGCCsGAQUFBwEBBCcwJTAjBggr
// SIG // BgEFBQcwAYYXaHR0cDovL29jc3AuZW50cnVzdC5uZXQw
// SIG // MgYDVR0fBCswKTAnoCWgI4YhaHR0cDovL2NybC5lbnRy
// SIG // dXN0Lm5ldC8yMDQ4Y2EuY3JsMBMGA1UdJQQMMAoGCCsG
// SIG // AQUFBwMIMB0GA1UdDgQWBBTDwnHSe9doBa47OZs0JQxi
// SIG // A8dXaDAfBgNVHSMEGDAWgBRV5IHREYC+2Im5CKMx+aEk
// SIG // CRa5cDANBgkqhkiG9w0BAQsFAAOCAQEAHSTnmnRbqnD8
// SIG // sQ4xRdcsAH9mOiugmjSqrGNtifmf3w13/SQj/E+ct2+P
// SIG // 8/QftsH91hzEjIhmwWONuld307gaHshRrcxgNhqHaijq
// SIG // EWXezDwsjHS36FBD08wo6BVsESqfFJUpyQVXtWc26Dyp
// SIG // g+9BwSEW0373LRFHZnZgghJpjHZVcw/fL0td6Wwj+Af2
// SIG // tX3WaUWcWH1hLvx4S0NOiZFGRCygU6hFofYWWLuRE/JL
// SIG // xd8LwOeuKXq9RbPncDDnNI7revbTtdHeaxOZRrOL0k2T
// SIG // dbXxb7/cACjCJb+856NlNOw/DR2XjPqqiCKkGDXbBY52
// SIG // 4xDIKY9j0K6sGNnaxJ9REjCCBgwwggT0oAMCAQICEQCN
// SIG // zhXzp5TFhwAAAABVkjP0MA0GCSqGSIb3DQEBCwUAMIGy
// SIG // MQswCQYDVQQGEwJVUzEWMBQGA1UEChMNRW50cnVzdCwg
// SIG // SW5jLjEoMCYGA1UECxMfU2VlIHd3dy5lbnRydXN0Lm5l
// SIG // dC9sZWdhbC10ZXJtczE5MDcGA1UECxMwKGMpIDIwMTUg
// SIG // RW50cnVzdCwgSW5jLiAtIGZvciBhdXRob3JpemVkIHVz
// SIG // ZSBvbmx5MSYwJAYDVQQDEx1FbnRydXN0IFRpbWVzdGFt
// SIG // cGluZyBDQSAtIFRTMTAeFw0yMDA3MjIxNTMzMjlaFw0z
// SIG // MDEyMjkxNjI5MjNaMHUxCzAJBgNVBAYTAkNBMRAwDgYD
// SIG // VQQIEwdPbnRhcmlvMQ8wDQYDVQQHEwZPdHRhd2ExFjAU
// SIG // BgNVBAoTDUVudHJ1c3QsIEluYy4xKzApBgNVBAMTIkVu
// SIG // dHJ1c3QgVGltZXN0YW1wIEF1dGhvcml0eSAtIFRTQTEw
// SIG // ggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDK
// SIG // PuwkYuH3/t/RNqk3ZtZ5FxSUQgCkhpe4J4zrT6n3067i
// SIG // qzAECChfm1Omh4ot3QJSX7W45bZQ8JyrEsHuGlZ4im5E
// SIG // P6mKj9fbU9nGR8gM3EZXAGcGFxqFt0Cqr3YH55BflJLV
// SIG // rtbXzXmhxTUrRIRfSRzVc7iBjXKUAmqpz1aSqjaUw1DJ
// SIG // VpeIXOF/X/373xSOPaskDfZ7j2r6bh76lb19kPjkQhS/
// SIG // VV4EVJMxQ/fD58IFEWisQGnHIzfsWkwpyd81s35JTsZ6
// SIG // 287CJZSeNz+I7CRNOY9/7xVrVExx8Q0hfFp10IdTiaBb
// SIG // 4B37nAfAqKG0ItBipMcXfzdOzi06WOPl8CaGTUIHn76j
// SIG // 4hmia3KlRr/LZFslyEX03ug8tv2c86Dvg0F8NnCQw1Ji
// SIG // sMd/PXvlloelVv8O6kkF37TdE29F05vII3kqMJmdmdzM
// SIG // zaUugVNSIvLQPaI3UpGRRnDWxUsF/0703GQGl/58kIYn
// SIG // r580VUiJqyLAdQeMIdkE0xyn6m2kyVIr4sQCiTBe55sx
// SIG // 5jllrXGt72db3KMk7Q3m4ql6OhhV3vBGLjRNGk2YgA1O
// SIG // 0WyFdbgDwgDVIkom0Y7d7bXUJ9Y6fGdphtdUP5fPZL6R
// SIG // q262nRkQebWXDvTRhcnkrsfAtKoHxB/BOlefzQ6meuUV
// SIG // hrKq9KKTLM+M91H63YzQSQIDAQABo4IBVzCCAVMwDgYD
// SIG // VR0PAQH/BAQDAgeAMBYGA1UdJQEB/wQMMAoGCCsGAQUF
// SIG // BwMIMEEGA1UdIAQ6MDgwNgYKYIZIAYb6bAoDBTAoMCYG
// SIG // CCsGAQUFBwIBFhpodHRwOi8vd3d3LmVudHJ1c3QubmV0
// SIG // L3JwYTAJBgNVHRMEAjAAMGgGCCsGAQUFBwEBBFwwWjAj
// SIG // BggrBgEFBQcwAYYXaHR0cDovL29jc3AuZW50cnVzdC5u
// SIG // ZXQwMwYIKwYBBQUHMAKGJ2h0dHA6Ly9haWEuZW50cnVz
// SIG // dC5uZXQvdHMxLWNoYWluMjU2LmNlcjAxBgNVHR8EKjAo
// SIG // MCagJKAihiBodHRwOi8vY3JsLmVudHJ1c3QubmV0L3Rz
// SIG // MWNhLmNybDAfBgNVHSMEGDAWgBTDwnHSe9doBa47OZs0
// SIG // JQxiA8dXaDAdBgNVHQ4EFgQULVaA7473SkMcQ6G13tnX
// SIG // qKprJigwDQYJKoZIhvcNAQELBQADggEBAFhLztj+gddR
// SIG // 2MdcjZLSTpUehYZD7eAa5pohQjNd45G++FB8dowlqUHU
// SIG // hJno6KK2mZdooiC9MqiqKXwKdhqfyFWOq9N71ON+WX6S
// SIG // cDkP7fYv80//dFzz5zA0QKMRo2typDIRBXz9kYtHqFc2
// SIG // Usf6tUWE0bI+QuUWXt0D06n9PXBnetoT4ISCZzhgVsOt
// SIG // sIjhCjd+YoEGuyME71igI6jRCWMwzdkZOPTrWndYvl+/
// SIG // 65Qt/y8EMGQQjz5ZVi46Nk8OPJYPj8nqfn9JMh+jX27a
// SIG // Ip/X2Rc5Wd5IF3oCS1hx/7cMLaHwZ6MR3PfJvNkey2wM
// SIG // FSd4SBZrLPGtl7h1bLuVw44xggSiMIIEngIBATCByDCB
// SIG // sjELMAkGA1UEBhMCVVMxFjAUBgNVBAoTDUVudHJ1c3Qs
// SIG // IEluYy4xKDAmBgNVBAsTH1NlZSB3d3cuZW50cnVzdC5u
// SIG // ZXQvbGVnYWwtdGVybXMxOTA3BgNVBAsTMChjKSAyMDE1
// SIG // IEVudHJ1c3QsIEluYy4gLSBmb3IgYXV0aG9yaXplZCB1
// SIG // c2Ugb25seTEmMCQGA1UEAxMdRW50cnVzdCBUaW1lc3Rh
// SIG // bXBpbmcgQ0EgLSBUUzECEQCNzhXzp5TFhwAAAABVkjP0
// SIG // MA0GCWCGSAFlAwQCAQUAoIIBqjAaBgkqhkiG9w0BCQMx
// SIG // DQYLKoZIhvcNAQkQAQQwHAYJKoZIhvcNAQkFMQ8XDTIw
// SIG // MTAyOTAzNTUxOVowLQYJKoZIhvcNAQk0MSAwHjANBglg
// SIG // hkgBZQMEAgEFAKENBgkqhkiG9w0BAQsFADAvBgkqhkiG
// SIG // 9w0BCQQxIgQgEj9ZwOdtWHXMkN4lGKq+rE9PWFUmdDaZ
// SIG // B7euM7aTcIkwggEMBgsqhkiG9w0BCRACLzGB/DCB+TCB
// SIG // 9jCB8wQglQom/cfAIBjp95GpXDjybu89pDJnyrDNFaVV
// SIG // r2MQcskwgc4wgbikgbUwgbIxCzAJBgNVBAYTAlVTMRYw
// SIG // FAYDVQQKEw1FbnRydXN0LCBJbmMuMSgwJgYDVQQLEx9T
// SIG // ZWUgd3d3LmVudHJ1c3QubmV0L2xlZ2FsLXRlcm1zMTkw
// SIG // NwYDVQQLEzAoYykgMjAxNSBFbnRydXN0LCBJbmMuIC0g
// SIG // Zm9yIGF1dGhvcml6ZWQgdXNlIG9ubHkxJjAkBgNVBAMT
// SIG // HUVudHJ1c3QgVGltZXN0YW1waW5nIENBIC0gVFMxAhEA
// SIG // jc4V86eUxYcAAAAAVZIz9DANBgkqhkiG9w0BAQsFAASC
// SIG // AgC602Ol+7lZQt1+Hv6Rl9d8YEcIhguz/DeCul1z93eg
// SIG // 2/04EDrFi8V3W2oRib8bvVzCJuzE6JZ4deskck5IpnyC
// SIG // rFMJaprc8VjtvhXNgO+RdpaQQjcJ89F9PR3hOE45Eztn
// SIG // /T3zQETbpX2bGXy22NGRaehZK+7j3GNZLOWQxwM4dS2r
// SIG // voMUubgEzaKcHFRU+uoYHeADIaWSwTak1JvSprqhpy60
// SIG // Gb0BpwdBVqkFD38Pre3Q6qtL6Bbji2xqCGfUXiUDtmA6
// SIG // +pFwqTm+dyHkyqsJ9qhDzz2MI/f+CvgScfhno3vCwHe7
// SIG // wHqn+vfXYE+GjE4UDNnPOG3W0VpIU9W5AKbSxaBbUdF7
// SIG // 6Xc6ksQ4dr/5p849XkxYBT3IGqEuOM+CCuopNrdiNh2t
// SIG // 2uopC6s3ObdqQF61xLZ1rx07qInQp7d05ip9T0tE7d5r
// SIG // ISvcCDBZHMrCeHOgiBOglw1lu8gcBWRgVLXJhx79eWGF
// SIG // uvDPKZqV3E9pJGGLvKd9TuRJyPd1f+h3d+c2TzkYk04N
// SIG // vdPaj5uZkKA5FxG1I3KyckM5KewaUo2Ep5lJ4yhnL68G
// SIG // IfVaUHXVwj+p0+Qc2JjTg6yYMM0uif9s8TiAyCVsnpzK
// SIG // wqF1+Q6Tr23Q5PpaP7GmPMEhNQdYzDBfXkZ7OusmQpDM
// SIG // AwoZSonEsFcMu7PoRm8ZxLyH7Q==
// SIG // End signature block
