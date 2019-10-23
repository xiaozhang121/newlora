createIframe(imgSrc) {

  if (document.getElementById('IframeReportImg').length === 0) {

    body.html('<iframe style="display:none;" id="IframeReportImg" name="IframeReportImg" onload="downloadImg();" width="0" height="0" src="about:blank"></iframe>')

  }

  if (document.getElementById('IframeReportImg').attr("src") != imgSrc) {

    document.getElementById('IframeReportImg').attr("src")

  } else {

    this.downloadImg()

  }

},

downloadImg() {

  if (document.getElementById('IframeReportImg').src != "about:blank") {

    window.frames["IframeReportImg"].document.execCommand("SaveAs");

  }

},

download(imgSrc, num){

  this.createIframe(imgSrc)

}
