"""Supervise a Cloudflare Tunnel and register its URL after each restart.

The existing Cloudflare OAuth account can deploy Workers but cannot edit DNS.
Registration through the shared secret keeps the public app at one origin while
allowing a quick Tunnel address to change after rig or cloudflared restarts.
"""
import os, re, signal, subprocess, threading, time
import requests

REGISTER=os.environ['AGROCEBADA_REGISTER_URL']
TOKEN=os.environ['AGROCEBADA_SERVICE_TOKEN']
origin=None
stopping=threading.Event()
process=None

def stop(*_):
    stopping.set()
    if process and process.poll() is None: process.terminate()

def register_loop():
    while not stopping.wait(15):
        if not origin: continue
        try:
            result=requests.post(REGISTER,json={'origin':origin},headers={'X-AgroCebada-Service-Token':TOKEN},timeout=12)
            if result.status_code!=200: print('Origin registration awaiting Worker availability.',flush=True)
        except requests.RequestException: print('Origin registration temporarily unavailable.',flush=True)

signal.signal(signal.SIGTERM,stop);signal.signal(signal.SIGINT,stop)
threading.Thread(target=register_loop,daemon=True).start()
while not stopping.is_set():
    origin=None
    process=subprocess.Popen(['/usr/local/bin/cloudflared','tunnel','--no-autoupdate','--protocol','http2','--url','http://127.0.0.1:8090'],stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,bufsize=1)
    for line in process.stdout:
        match=re.search(r'https://[a-z0-9-]+\.trycloudflare\.com',line)
        if match:
            origin=match.group();print('Cloudflare Tunnel assigned: '+origin,flush=True)
        elif 'Registered tunnel connection' in line: print('Cloudflare Tunnel connected.',flush=True)
        if stopping.is_set(): break
    process.wait()
    if not stopping.wait(5): print('Restarting Cloudflare Tunnel.',flush=True)
