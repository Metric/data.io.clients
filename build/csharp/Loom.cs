using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System;

public class Loom : MonoBehaviour {

	public static Queue<Action> m_queue;
	
	void Start() {
		m_queue = new Queue<Action>();
	}
	
	void Update() {
		try {
			if(m_queue != null) {
				Action ac = null;
				lock (m_queue) {
					if(m_queue.Count > 0) {
						ac = m_queue.Dequeue();
						
					}
				}
				
				if(ac != null) {
					ac();
				}
			}
		} catch (Exception e) {
			Debug.LogException(e);
		}
	}
	
	public static void RunOnMain(Action action) {
		if (m_queue != null) {
			lock (m_queue) {
				m_queue.Enqueue (action);
			}
		}
	}
}
