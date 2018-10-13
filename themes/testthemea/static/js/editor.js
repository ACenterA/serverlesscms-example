
// Anonymous "self-invoking" function
var noConsoleAvail = {
  log: function() {

  },
  error: function() {

  },
}
window.console = noConsoleAvail;

(function() {
   function grapeCodeAsync(head, content) {
       if(typeof grapesjs=='undefined') {
           setTimeout(function() {
		            grapeCodeAsync(head, content);
           }, 100);
        } else {
		          grapeCode(head, content)
	      }
   }

   function grapeCode(head,content) {

    var myNode = document.getElementsByTagName("body")[0];
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    var containerGjs = document.createElement('div');
    containerGjs.id = 'gjs';
    myNode.appendChild(containerGjs);
    $('body').attr('style', '');
    $("body").css({margin: 0, padding:0});

    //var tmphtmlContent = $("body").html();
    var editor = grapesjs.init({
        allowScripts: 1,
        showOffsets: 1,
        autorender: 0,
        noticeOnUnload: 0,
        container  : '#gjs',
        height: '100%',
        components: content,
        headers: head,
        clearOnRender: 0,

        storageManager:{
          autoload: 0,
          storeComponents: 1,
          storeStyles: 1,
        }
    });


    // Assign handlers immediately after making the request,
    // and remember the jqxhr object for this request
    var jqxhr = $.get( "/api?data=templates/blocks", function(data) {
       console.log("success");
       console.log(data);
       var len = data.length;
       var bm = editor.BlockManager;
       var pageManager = editor.PageManager;
       for (var i = 0; i < len; i++) {
           var blockElement = data[i];

           if (blockElement.hasOwnProperty("ContentHtml")) {
             blockElement["content"] = blockElement["ContentHtml"];
           };
           bm.add(blockElement.Name, blockElement);

           //convert item for block editing   ...
           var pageObj = JSON.parse(JSON.stringify(blockElement))
           //console.error("GOT PAGE OBJ")
           if (pageObj.content.hasOwnProperty("type")) {
             //cannot update these yet, as they are basic elements and not HTML Ones.
           } else {
             pageObj.category = 'Block';
             pageObj.command = 'block-edit';
             pageManager.add(pageObj.Name, pageObj);
           }
       }
    })
      .done(function(e) {
        //console.log("scucess done");
    })
      .fail(function(e) {
      //console.log('error');
      //console.log(e);
    })
      .always(function() {
        //console.log('get finished');
    });


/*
var bm = editor.BlockManager;
  bm.add('link-block', {
    label: 'Link Block',
    attributes: {class:'fa fa-link'},
    category: 'Basic',
    content: {
      type:'link',
      editable: false,
      droppable: true,
      style:{
        display: 'inline-block',
        padding: '5px',
        'min-height': '50px',
        'min-width': '50px'
      }
    },
  });
*/

    editor.render();
    window.editor = editor;

   }

   function myJQueryCode() {
    //Do stuff with jQuery
    $("#acentera_ignore").remove()
    $("#acentera_js_ignore").remove()
    var scripts = document.getElementsByTagName("script");
      for (var i=0;i<scripts.length;i++) {
         if (scripts[i].src) {
             console.log("SRC:");
             console.log(scripts[i].id);
	     if (scripts[i].id.indexOf("acentera_ignore")>=0) {
		$('#' + scripts[i].id).remove();
	     } else {

	     }
	 } else {
             console.log("CONTENT:");
             console.log(i,scripts[i].innerHTML)
         }
    }

    var htmlContent = $("body").html();
    var headContent = $("head").html();
    console.error("HTML CONTENT");
    console.error(htmlContent);

    if(typeof grapejs=='undefined') {

       var headTag = document.getElementsByTagName("head")[0];

       var styles = document.createElement('link');
       styles.rel = 'stylesheet';
       styles.type = 'text/css';
       styles.media = 'screen';
       //styles.href = '/css/grapes.min.css';
       //styles.href = 'http://localhost:8080/dist/css/grapes.min.css';
       styles.href = '/css/grapes.min.css';
       headTag.appendChild(styles);

       var jqTag = document.createElement('script');
       jqTag.id="acentera_js_ignore",
       jqTag.type = 'text/javascript';
       //jqTag.src = '/js/grapes.min.js';
       //jqTag.src = 'http://localhost:8080/dist/grapes.min.js';
       jqTag.src = '/js/grapes.min.js';
       jqTag.onload = grapeCodeAsync(headContent, htmlContent);
       headTag.appendChild(jqTag);

       //<link rel="stylesheet" href="/css/grapes.min.css">
    } else {
        grapeCode(htmlContent);
    }


   }


   if(typeof jQuery=='undefined') {
       var headTag = document.getElementsByTagName("head")[0];
       var jqTag = document.createElement('script');
       jqTag.id="acentera_js_ignore",
       jqTag.type = 'text/javascript';
       jqTag.src = '/js/jquery-2.0.3.min.js';
       jqTag.onload = myJQueryCode;
       headTag.appendChild(jqTag);
   } else {
        myJQueryCode();
   }
})();

/*
<div id="ignore">
<script src="http://code.jquery.com/jquery-2.2.0.min.js"></script>
<!--

<div id="gjs"></div>

<script type="text/javascript">
</script>
</div>
*/
