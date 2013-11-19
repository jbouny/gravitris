/** 
 * @author Jérémy BOUNY / https://github.com/jbouny | http://www.jeremybouny.fr
 * @file js/game.js
 * 
 * Part of the project gravitris https://github.com/jbouny/gravitris
 * 
 * Contains all the game core and game objects.
 */

/**
 * Represents a unique block that compose shapes.
 */
function Block( inX, inY, inZ, inType, inBody )
{
	this.m_Type = inType;
	this.m_X = inX;
	this.m_Y = inY;
	this.m_Z = inZ;
	this.m_Body = inBody;
	this.m_Rotation = 0;
};

/**
 * A shape is an object movable by the user when he control it.
 * It is composed of blocks.
 */
function Shape( inBlocks, inType )
{
	this.m_Blocks = inBlocks;
	this.m_Type = inType;
}
/**
 * The factory provides an easy way to create instances of tetris shapes.
 */
var ShapeFactory =
{
	Type: { I : 0, J : 1, L : 2, O : 3, Z : 4, T : 5, S : 6 },
	RevertType: [ 'I', 'J', 'L', 'O', 'Z', 'T', 'S' ],
	ms_B2DWorld: null,
	ms_B2DShape: null,
	ms_Shapes: { 
		0: [ [ 0, 1, 0 ], [ 0, 1, 0 ], [ 0, 1, 0 ], [ 0, 1, 0 ] ],
		1: [ [ 0, 1, 0 ], [ 0, 1, 0 ], [ 1, 1, 0 ], [ 0, 0, 0 ] ],
		2: [ [ 0, 1, 0 ], [ 0, 1, 0 ], [ 0, 1, 1 ], [ 0, 0, 0 ] ],
		3: [ [ 1, 1, 0 ], [ 1, 1, 0 ], [ 0, 0, 0 ], [ 0, 0, 0 ] ],
		4: [ [ 1, 1, 0 ], [ 0, 1, 1 ], [ 0, 0, 0 ], [ 0, 0, 0 ] ],
		5: [ [ 0, 1, 0 ], [ 1, 1, 1 ], [ 0, 0, 0 ], [ 0, 0, 0 ] ],
		6: [ [ 0, 1, 1 ], [ 1, 1, 0 ], [ 0, 0, 0 ], [ 0, 0, 0 ] ]
	},
	ms_NextShape: 0,
	CreateShape: function( inType )
	{
		var aBlocks = this.ms_Shapes[inType];
		var aBlocksShape = new Array();
		
		for( var i = 0; i < 4; ++i )
		{
			for( var j = 0; j < 3; ++j )
			{
				if( aBlocks[i][j] == 1 )
				{
					var aX = Math.round( Config.ms_GameWidth * 0.5 - 1 + j ); 
					var aY = i; 
					var aZ = 0.1 - Math.random() * 0.2;
		
					var aBd = new Box2D.b2BodyDef();
					aBd.set_type( Box2D.b2_dynamicBody );
					aBd.set_position( new Box2D.b2Vec2( aX, aY ) );
					var aBody = this.ms_B2DWorld.CreateBody( aBd );
					aBody.CreateFixture( this.ms_B2DShape, 1.0 );
					aBody.SetAwake( 1 );
					aBody.SetActive( 1 );
								
					aBlocksShape.push( new Block( aX, aY, aZ, inType, aBody ) );
				}
			}
		}
		
		return new Shape( aBlocksShape, inType );
	},
	RandomShape: function()
	{
		var aNewType = this.ms_NextShape;
		this.ms_NextShape = Math.floor( Math.random() * 7 );
		return ShapeFactory.CreateShape( aNewType );
	},
	Next: function()
	{
		return this.RevertType[this.ms_NextShape];
	},
	Initialize: function( inB2DWorld, inB2DShape )
	{
		this.ms_B2DWorld = inB2DWorld;
		this.ms_B2DShape = inB2DShape;
	},
};

/**
 * Game core
 */
var Game = {
	ms_Shape: null,
	ms_Blocks: [],
	ms_IsPause: false,
	ms_B2DWorld: null,
	ms_B2DShape: null,
	
	Initialize: function()
	{
		// Initialize 2D Physic
		this.InitializeBox2D();
		
		// Get an alea shape at the beginning
		ShapeFactory.Initialize( this.ms_B2DWorld, this.ms_B2DShape );
		this.ms_Shape = ShapeFactory.RandomShape();
		
		// Initialize game board
		this.ms_Blocks = [];
	},
	
	InitializeBox2D: function()
	{	
		var aGravity = new Box2D.b2Vec2( 0.0, Config.ms_Gravity );
		this.ms_B2DWorld = new Box2D.b2World( aGravity, true );
		
        var aEdgeShape = new Box2D.b2EdgeShape();
        aEdgeShape.Set( new Box2D.b2Vec2( -500.0, Config.ms_GameHeight - 0.5 ), new Box2D.b2Vec2( 500.0, Config.ms_GameHeight - 0.5 ) );
        Game.ms_B2DWorld.CreateBody( new Box2D.b2BodyDef() ).CreateFixture( aEdgeShape, 0.0 );
		
        aEdgeShape = new Box2D.b2EdgeShape();
        aEdgeShape.Set( new Box2D.b2Vec2( -0.5, Config.ms_GameHeight * 0.33 ), new Box2D.b2Vec2( -0.5, Config.ms_GameHeight -0.5 ) );
        Game.ms_B2DWorld.CreateBody( new Box2D.b2BodyDef() ).CreateFixture( aEdgeShape, 0.0 );
		
        aEdgeShape = new Box2D.b2EdgeShape();
        aEdgeShape.Set( new Box2D.b2Vec2( Config.ms_GameWidth - 0.5, Config.ms_GameHeight * 0.33 ), new Box2D.b2Vec2( Config.ms_GameWidth - 0.5, Config.ms_GameHeight - 0.5 ) );
        Game.ms_B2DWorld.CreateBody( new Box2D.b2BodyDef() ).CreateFixture( aEdgeShape, 0.0 );
		
        this.ms_B2DShape = new Box2D.b2PolygonShape();
        this.ms_B2DShape.SetAsBox( 0.49, 0.49 );
	},
	
	ReadB2DObject: function( inData, inBody )
	{
		var aPos = inBody.GetPosition();
		inData.x = aPos.get_x();
		inData.y = aPos.get_y();
		inData.angle = inBody.GetAngle();
	},
	
	UpdateGravity: function( inTime )
	{
		if( this.ms_IsPause )
			return;
		Game.ms_B2DWorld.Step(
			inTime,
			20,			// velocity iterations
			20			// position iterations
		);
		
		var aData = { x: 0, y: 0, angle: 0 };
		if( Game.ms_Shape != null )
		{
			for( var i = 0; i < Game.ms_Shape.m_Blocks.length; ++i ) 
			{
				var aBlock = Game.ms_Shape.m_Blocks[i];
				this.ReadB2DObject( aData, aBlock.m_Body );
				
				aBlock.m_X = aData.x;
				aBlock.m_Y = aData.y;
				aBlock.m_Rotation = aData.angle;
			}
		}	
		for( var i = 0; i < Game.ms_Blocks.length; ++i ) 
		{
			var aBlock = Game.ms_Blocks[i];
			this.ReadB2DObject( aData, aBlock.m_Body );
			
			aBlock.m_X = aData.x;
			aBlock.m_Y = aData.y;
			aBlock.m_Rotation = aData.angle;
		}	
	},
	
	Fall: function()
	{
		if( this.ms_IsPause )
			return;
		
		// If the current shape is stopped, create a new shape
		var aShape = this.ms_Shape;
		this.ms_Shape = ShapeFactory.RandomShape();
		for( var i = 0; i < aShape.m_Blocks.length; ++i ) 
			this.ms_Blocks.push( aShape.m_Blocks[i] );
	},
	
	Pause: function() 
	{ 
		this.ms_IsPause = ! this.ms_IsPause; 
	},
	
	Reload: function()
	{
		this.ms_Score = 0;
		Game.ms_TotalLines = 0;
		this.ms_IsPause = false;
		if( this.ms_Shape != null )
			for( var i = 0; i < this.ms_Shape.m_Blocks.length; ++i )
				this.ms_B2DWorld.DestroyBody( this.ms_Shape.m_Blocks[i].m_Body );
		for( var i = 0; i < this.ms_Blocks.length; ++i )
			this.ms_B2DWorld.DestroyBody( this.ms_Blocks[i].m_Body );
		this.ms_Shape = ShapeFactory.RandomShape();
		this.ms_Blocks = [];
	},
	
	ApplyImpulse: function( inX, inY )
	{
		if( this.ms_Shape != null )
			for( var i = 0; i < this.ms_Shape.m_Blocks.length; ++i )
				this.ms_Shape.m_Blocks[i].m_Body.ApplyForce( new Box2D.b2Vec2( inX, inY ), this.ms_Shape.m_Blocks[i].m_Body.GetWorldCenter() );
	},
	
	Left: function() { this.ApplyImpulse( -Config.ms_AppliedForce, 0.0 ); },
	Up: function() { this.ApplyImpulse( 0.0, -Config.ms_AppliedForce ); },
	Right: function() { this.ApplyImpulse( Config.ms_AppliedForce, 0.0 ); },
	Down: function() { this.ApplyImpulse( 0.0, Config.ms_AppliedForce ); },
};