<?php
?>
<html>
	<head>

		<title>Date Widget Test</title>

		<script src="mdcore.js"></script>
		<script src="mdajax.js"></script>
		<script src="mdbox.js"></script>
		<script src="scripts/textwidget.js"></script>
		<script src="scripts/dateprovider1.js"></script>

		<style type="text/css">

		div.datewidget * {
			margin:0;
			padding:0;
			border:0;
			font-family: monospace;
		}

		div.datewidget span {
			padding: 0.5px;
			font-size: 0.9em;
		}

		div.datewidget.small {
			width: 172px;
			margin-bottom:10px;
			padding:0;
			border-radius: 4px;
			float:left;
			z-index:1;
		}

		.datewidget.small:after {
		    clear: both;
		    content: ".";
		    display: block;
		    height: 10px;
		    visibility: hidden;
		}

		div.datewidget.small>div {
			background-color: white;
			position: absolute;
			width: 172px;
			z-index:1;
		}

		div.datewidget.small div.header {
			text-align: center;
			padding: 2px;
			color: #555555;
			border-right: 1px solid #e0e0e0;
			border-left: 1px solid #e0e0e0;
			border-top: 1px solid #e0e0e0;
		}

		div.datewidget.small div.header a {
			padding-right: 0.5px;
			font-size: 0.9em;
		}

		div.datewidget.small div.header a.next{
			display:block;
			float:right;
			margin-left: 1.5px;
			font-size: 0.9em;
		}

		div.datewidget.small div.header a.prev {
			display: block;
			float:left;
			margin-right: 1.5px;
			font-size: 0.9em;
		}

		div.datewidget ul{
			list-style-type: none;
		}

		div.datewidget .bold {
			font-weight: bold;
		}

		div.datewidget.invisible {
			display: none;
		}

		div.datewidget.visible {
			display :block;
		}

		div.datewidget .invisible {
			display: none;
		}

		div.datewidget .visible {
			display :block;
		}

		div.datewidget.small ul.month {
			border-right: 1px solid #e0e0e0;
			border-left: 1px solid #e0e0e0;
			border-bottom: 1px solid #e0e0e0;
		}

		div.datewidget.small ul.month li {
			display: inline-block;
			text-align: right;
			padding: 2px;
		}

		div.datewidget.small ul.week {
			display: inline-block;
			text-align: right;
			border-right: 1px solid #e0e0e0;
			border-left: 1px solid #e0e0e0;
			border-bottom: 1px solid #e0e0e0;
			padding:1px;
		}

		div.datewidget.small ul.week li {
			display: inline-block;
			text-align: right;
			padding: 2px;
		}

		div.datewidget.small li.weekend {
			color :red;
		}

		/* anchors wont inherit the color from the parent.
		Set it explicititly */
		div.datewidget.small li.weekend a {
			color :red;
		}

		div.datewidget.small li.current-date a {
			background-color :#42A3CE;
			color: white;
		}

		div.datewidget.small li.today a {
			background-color :#fcefa1;
			color: #555555;
		}

		div.datewidget.small li{
			width:20px;
			font-size: .8em;
		}

		div.datewidget.small li a {
			text-decoration: none;
			padding: 2px;
			color: #555555;
			width:20px;
			display: block;
		}

		div.datewidget.small input[type="text"] {
			padding:3px;
			border: 1px solid #e0e0e0;
		}
		</style>

		<style type="text/css">

		div.textwidget * {
			margin:0;
			padding:0;
			border:0;
			font-family: monospace;
		}

		div.textwidget {
			width: 172px;
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
			<div class="datewidget small" id="datewidget" data-bind="column_name"></div>
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

		var dp = new DateProvider( new Date(2014, 8, 23) ),
			dw = document.getElementById( "datewidget" ),
			mc = new MonthCalendar( dw, dp );

		</script>

	</body>
</html>
<?php
?>