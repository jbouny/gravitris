/** 
 * @author Jérémy BOUNY / https://github.com/jbouny | http://www.jeremybouny.fr
 * @file js/displayASCII.js
 * 
 * Part of the project gravitris https://github.com/jbouny/gravitris
 * 
 * Display the tetris game in an 2D View.
 */

 var Display2D =
{
	ms_Canvas: null,
	ms_Context: null,
	ms_Scale: 0,
	ms_Colors: [ "#0FF", "#00F", "#F90", "#FF0", "#F00", "#C0F", "#0F0" ],
	ms_BlockSize: 0,
	ms_IsDisplaying: false,
	
	Id: function() { return '2d'; },
	Title: function() { return '2D'; },
	ConvertX: function( inX ) { return Window.ms_MiddleX - ( Config.ms_GameWidth * 0.5 - inX ) * this.ms_Scale  },
	Initialize: function( inIdCanvas )
	{
		this.ms_Canvas = document.getElementById( 'canvas-' + this.Id() );
		this.ms_Context = this.ms_Canvas.getContext( "2d" );
		this.Resize( Window.ms_Width, Window.ms_Height );
	},
	DrawBlock: function( inBlock )
	{
		this.ms_Context.fillStyle = this.ms_Colors[inBlock.m_Type];
		this.ms_Context.save();
		var aX = Math.round( this.ConvertX( inBlock.m_X ) );
		var aY = Math.round( inBlock.m_Y * this.ms_Scale );
		var aDelta = this.ms_BlockSize/2;
		this.ms_Context.translate( aX + aDelta, aY + aDelta );
		this.ms_Context.rotate( inBlock.m_Rotation );
		this.ms_Context.translate( -aX - aDelta, -aY - aDelta );
		this.ms_Context.fillRect( aX, aY, this.ms_BlockSize, this.ms_BlockSize ); 
		this.ms_Context.restore();
	},
	Display: function()
	{
		if( !this.ms_IsDisplaying )
		{
			this.ms_IsDisplaying = true;
			this.ms_BlockSize = this.ms_Scale;
			
			// Draw background
			this.ms_Context.clearRect( 0, 0, Window.ms_Width, Window.ms_Height );
			this.ms_Context.fillStyle = "#000";
			this.ms_Context.fillRect( 0, 0, Window.ms_Width, Window.ms_Height );
			this.ms_Context.strokeStyle = "#555";
			this.ms_Context.beginPath();
			var aLeft = Window.ms_MiddleX - Config.ms_GameWidth * 0.5 * this.ms_Scale,
				aRight = Window.ms_MiddleX + Config.ms_GameWidth * 0.5 * this.ms_Scale,
				aTop = Config.ms_GameHeight * this.ms_Scale * 0.33 + this.ms_Scale * 0.5,
				aBottom = this.ms_Scale * Config.ms_GameHeight;
			this.ms_Context.moveTo( aLeft, aTop );
			this.ms_Context.lineTo( aLeft, aBottom );
			this.ms_Context.lineTo( aRight, aBottom );
			this.ms_Context.lineTo( aRight, aTop );
			this.ms_Context.stroke();
				
			// Draw fixed blocks
			for( var i = 0; i < Game.ms_Blocks.length; ++i ) 
				this.DrawBlock( Game.ms_Blocks[i] );
				
			// Draw the movable object
			if( Game.ms_Shape != null )
				for( var i = 0; i < Game.ms_Shape.m_Blocks.length; ++i )
					this.DrawBlock( Game.ms_Shape.m_Blocks[i] );
			
			// Pause or game over
			if( Game.ms_IsPause )
			{
				var aText = "Pause";
				this.ms_Context.fillStyle = "rgba(0, 0, 0, 0.5)";
				this.ms_Context.fillRect( Window.ms_MiddleX - 50, Window.ms_MiddleY - 30, 100, 30 ); 
				this.ms_Context.fillStyle = "#ffffff";
				this.ms_Context.textAlign = 'center';
				this.ms_Context.font = '12pt Calibri';
				this.ms_Context.fillText( aText, Window.ms_MiddleX, Window.ms_MiddleY - 10 );
			}
			this.ms_IsDisplaying = false;
		}
	},
	Resize: function( inWidth, inHeight )
	{
		this.ms_Canvas.width = inWidth;
		this.ms_Canvas.height = inHeight;
		this.ms_Scale = Window.ms_Height / Config.ms_GameHeight;
		this.Display();
	}
};