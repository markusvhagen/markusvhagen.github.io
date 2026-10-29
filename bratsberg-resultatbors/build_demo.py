"""Build the portable application from the HTML/CSS/JS and JSON sources."""
from pathlib import Path
import json
import re
from urllib.parse import quote

root=Path(__file__).resolve().parent
dist=root/'dist'
manifest=json.loads((dist/'data/index.json').read_text())
data={
 **manifest,
 'races':sorted([json.loads((dist/f).read_text()) for f in manifest['races']],key=lambda r:r['date'],reverse=True),
 'portraits':json.loads((dist/manifest['portraits']).read_text()) if manifest.get('portraits') else {},
 'athletes':json.loads((dist/manifest['athletes']).read_text()) if manifest.get('athletes') else None,
 'records':json.loads((dist/manifest['records']).read_text()),
 'relays':json.loads((dist/manifest['relays']).read_text()) if manifest.get('relays') else [],
 'upcoming':sorted(json.loads((dist/manifest['upcoming']).read_text()),key=lambda r:r['date']),
}
embedded=json.dumps(data,ensure_ascii=False).replace('<','\\u003c').replace('>','\\u003e').replace('&','\\u0026')
def module(name):
 text=(dist/name).read_text()
 text=re.sub(r'^import .*?;\n','',text,flags=re.M)
 return re.sub(r'\bexport\s+(?=(?:async\s+)?(?:function|const|let|class)\b)','',text)
common=module('data.js')
start=common.index('async function loadData()')
end=common.index('\nfunction showError',start)
common=common[:start]+'async function loadData(){const embedded='+embedded+';return prepareResultsData(embedded);}'+common[end:]
app=module('app.js').replace('if(portal)initPortal();else initHome();','initHome();initPortal();')
app=app.replace('function route(){', '''function route(){
  const isHome=!location.hash||location.hash==='#hjem'||location.hash==='#home-main';
  document.querySelector('#home-view').hidden=!isHome;
  document.querySelector('#portal-view').hidden=isHome;
  document.querySelector('.skip-link').href=isHome?'#home-main':'#portal-main';
''')
home=(dist/'index.html').read_text()
portal=(dist/'resultater.html').read_text()
portal_main=re.search(r'<main.*?</main>',portal,re.S).group(0).replace('id="main"','id="portal-main"')
home_main=re.search(r'<main.*?</main>',home,re.S).group(0).replace('id="main"','id="home-main"')
html=re.sub(r'<main.*?</main>','<div id="home-view">'+home_main+'</div><div id="portal-view" hidden>'+portal_main+'</div>',home,count=1,flags=re.S)
html=re.sub(r'<link rel="stylesheet"[^>]+>','',html).replace('<script type="module" src="app.js"></script>','')
css='\n'.join((dist/name).read_text() for name in ['styles.css','athlete-cards.css','widget.css','portal.css','relays.css','calendar.css'])
html=html.replace('</head>','<style>'+css+'</style></head>')
script='\n'.join([module('record-check.js'),module('result-order.js'),module('performance-history.js'),module('athlete-registry.js'),common,module('portrait.js'),module('athlete-cards.js'),module('archive.js'),module('carousel-clock.js'),module('widget.js'),module('relays.js'),module('calendar.js'),app])
html=html.replace('</body>','<script type="module">'+script+'</script></body>')
html=html.replace('resultater.html#','#').replace('resultater.html','#resultater').replace('index.html','#hjem')
logo='data:image/svg+xml,'+quote((dist/'assets/mark.svg').read_text(),safe='')
html=html.replace('assets/mark.svg',logo).replace('<title>Bratsberg Friidrett · Resultatbørsen</title>','<title>Bratsberg · Resultatbørsen</title>')
out=root/'Bratsberg-resultatbors.html';out.write_text(html)
print(f'Built {out.name} ({out.stat().st_size:,} bytes)')
