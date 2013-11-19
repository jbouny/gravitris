/** 
 * @author Jérémy BOUNY / https://github.com/jbouny | http://www.jeremybouny.fr
 * @file js/config.js
 * 
 * Part of the project gravitris https://github.com/jbouny/gravitris
 * 
 * Contains all configuration that concern the game.
 */

var Config =
{
	ms_GameWidth: 13,
	ms_GameHeight: 30,
	ms_Gravity: 20,
	ms_Ips: 60,
	ms_RatioForce: 60,
	
	ms_AppliedForce: 0,
	ms_DelayMs: 0,
	ms_FrameRate: 0,
	
	Initialize: function()
	{
		this.ms_FrameRate = 1 / this.ms_Ips;
		this.ms_DelayMs = this.ms_FrameRate * 1000;
		this.ms_AppliedForce = this.ms_RatioForce * this.ms_Ips;
	},
};