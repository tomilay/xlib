<?php
?>
<html>
	<head>

		<title>Text Widget Test</title>

		<script src="mdcore.js"></script>
		<script src="mdajax.js"></script>
		<script src="mdbox.js"></script>
		<script src="scripts/textwidget.js"></script>

		<style type="text/css">

		div.textwidget * {
			margin:0;
			padding:0;
			border:0;
			font-family: monospace;
		}

		div.textwidget {
			width: 200px;
			/*margin-bottom:10px;*/
			padding:0;
			border-radius: 4px;
			float:left;
		}

		.textwidget:after {
		    clear: both;
		    content: ".";
		    display: block;
		    height: 10px;
		    visibility: hidden;
		}

		div.textwidget input[type="text"] {
			padding:5px;
			border: 1px solid #e0e0e0;
			border-radius: 4px;
			width:100%;
		}

		div.textwidget input[type="text"].entry {
			color:black;
			padding:5px;
			border: 1px solid #e0e0e0;
			border-radius: 4px;
			width:100%;
		}

		div.textwidget input[type="text"].prompt {
			color:#e0e0e0;
			padding:5px;
			border: 1px solid #e0e0e0;
			border-radius: 4px;
			width:100%;
		}

		div.textwidget input[type="text"].invalid {
			color:red;
			padding:5px;
			border: 1px solid red;
			border-radius: 4px;
			width:100%;
		}

		.clearfix:after {
		    clear: both;
		    content: ".";
		    display: block;
		    height: 10px;
		    visibility: hidden;
		}
		</style>

	</head>
	<body>

		<div class="front clearfix">
			<div class="textwidget" id="textwidget" prompt="MM/DD/YYYY" data-bind="column_name" valid-ptn="^\d{1,2}\/\d{1,2}\/\d{4}$"></div>
		</div>

 		<div class="back">
			<ul>
				<li id="listing" name="listing">
					<div class="info">
						<div class="data">
							<ul class="attributes clearfix">
								<li><label>City:</label><span data-bind="city"></span></li>

								<li><label>Listing #:</label> <span>06067477</span></li>

								<li><label>Status:</label> <span data-bind="status"></span></li>
							</ul>
							<div>
								<label>Description:</label> <span data-bind="description"></span>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>

		<script type="text/javascript">

		var tw = document.getElementById( "textwidget" );

			txtW = new TextWidget( tw, {mode:"entry"} );

			txtW.setValue( "12/12/1990" );
		</script>

	</body>
</html>
<?php
?>