// ------------------------------------------------------------------------------
//  <autogenerated>
//      This code was generated by a tool.
//      Mono Runtime Version: 4.0.30319.1
// 
//      Changes to this file may cause incorrect behavior and will be lost if 
//      the code is regenerated.
//  </autogenerated>
// ------------------------------------------------------------------------------
using System;
using SimpleJson;

namespace Data.io
{
	//Simple packet wrapper for SimpleJson parsing
	//And easy toJson function for sending
	public class Packet
	{
		public string name { get; set; }
		public object[] data { get; set; }

		public Packet() {
		
		}

		public Packet (string eventName, object[] data)
		{
			this.name = eventName;

			if (data == null) {
				data = new object[] {};
			}

			this.data = data;
		}

		public string toJson() {
			string results = SimpleJson.SimpleJson.SerializeObject(this);

			return results;
		}
	}
}
