# encoding=utf-8
from bs4 import BeautifulSoup
import sys

try:
    html_doc = sys.argv[1]
    soup = BeautifulSoup(html_doc, 'html.parser')
    print soup.text.encode('utf-8').strip()
except:
    print ""
