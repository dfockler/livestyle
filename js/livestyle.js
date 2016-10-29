$(document).ready(function(){
	$('.object').liveeditor();
});

function addNewObject() {
	objTemplate = $('#headings').clone();

	objName = $('#object-name').val(); //Get the object's name
	
	objTemplate.attr('id', objName.toLowerCase()); //Change ID to lowercase
	objTemplate.find('.object-title').html(objName); //Change object's title
	
	$('.objects').append(objTemplate);
	objTemplate.find('.content').html('');
	objTemplate.liveeditor();
	objTemplate.find('#htmlEditor > .CodeMirror')[0].remove();
	objTemplate.find('#cssEditor > .CodeMirror')[0].remove();
	
	objTemplate.show();
}

(function ( $ ) {
	$.fn.liveeditor = function() {

		function processValue(value){
			modules = getWordsBetweenCurlies(value);
			if( modules.length <= 0 ){
				return value;
			}
			else{
				module = $('#' + modules[0]).find('.content').html();
				value = replaceCurlies(value, modules[0], module);
				return value;
			}
		}

		function replaceCurlies(str, target, replacement) {
			return str.replace(new RegExp('{{ '+ target + ' }}', 'gi'), replacement);
		}

		function getWordsBetweenCurlies(str) {
		  var results = [], re = /{{([^}]+)}}/g, text;

		  while(text = re.exec(str)) {
		    results.push(text[1].trim());
		  }
		  return results;
		}

		function loadHTMLEditor(obj){
			editor = obj.find('#htmlEditor')[0];

			if (editor !== undefined) {
				obj.htmlEditor = CodeMirror(editor, {
					value: "",
					mode:  "xml",
					theme: "blackboard",
					lineNumbers: true,
					keyMap: "sublime",
					profile: 'html'
				});

				obj.htmlEditor.on('change', function(){
					var value = obj.htmlEditor.getValue();
					value = processValue(value);
					obj.find('.content').html(value);
				});
			}
		}

		function loadCssEditor(obj){
			editor = obj.find('#cssEditor')[0];

			if (editor !== undefined){
				obj.cssEditor = CodeMirror(obj.find('#cssEditor')[0], {
				  value: "",
				  mode:  "sass",
				  theme: "blackboard",
				  lineNumbers: true,
				  keyMap: "sublime"
				});

				obj.cssEditor.on('change', function(){
					var value = obj.cssEditor.getValue();
					value = Sass.compile(value);
					obj.find('.content-style').html(value);
				});
			}
		}
		
		this.each(function() {
			loadHTMLEditor($(this));
			loadCssEditor($(this));
		});

		return this;
	};
}( jQuery ));