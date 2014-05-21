![alt tag](https://raw.githubusercontent.com/basilesimon/EU-elections-2014/master/public/img/sreenshot-readme.png)
#EU-elections-2014

Unnecessary exploration of the 2014 European election in the UK.

######Disclaimer
This content is not published by BBC News and must not be considered as BBC words.

####To-do
- [ ] Fix cross-domain issues
- [ ] Pre-calculate the results
- [ ] Design UI for semantic data section
- [ ] **Feature:** filter media coverage breakdown by publisher
- [ ] Update mentions by party JSON
- [ ] **Feature:** graph mentions by party over time
- [ ] Add sentence about the fact that we don't have info on many candidates
- [ ] Add Abstract two-liners for candidates

####Ideas
- Dashboard to follow the elections
- Highlight the different media coverages the parties and candidates receive
- Find patterns in the data
- Provide background info *after* the election
    - Enter your postcode and find out more about your elected MEP

#####External data sources

- [YouGov national poll 18.05.2014](http://d25d2506sfb94s.cloudfront.net/cumulus_uploads/document/eh81zosob6/YG-Archive-Pol-Sunday-Times-results-140516.pdf)
- [YouGov national poll 19.05.2014](http://d25d2506sfb94s.cloudfront.net/cumulus_uploads/document/ljf9nyfq9s/YG-Archive-Pol-Sun-results-190514-EU.pdf)
- [Base files for list of candidates by xavriley (github)](https://github.com/basilesimon/uk-mep-candidates-2014)
- [Number of candidates by party and mentions by party (Google spreadsheet)](https://docs.google.com/spreadsheets/d/1875deO7un6yF0k9hTGdhevJqW8tg6rPkj3R8gaWxspE/edit?usp=sharing)

#####Structure
```
.
+-- README
+-- .gitignore
+-- /public
|   +-- index.html (webpage core)
|   +-- /css
|       +-- bootstrap.min.css
|       +-- main css (custom styles)
|   +-- /img (obvious)
|   +-- /js
|       +-- main.js (custom script core)
|       +-- /lib
|           +-- bootstrap.min.js
|           +-- chart.js
|           +-- d3.js
|           +-- jquery-1.10.2.min.js
|           +-- juicer-api.js (bbc)
|           +-- newslabs-api.js (bbc)
|           +-- moment.min.js
|   +-- /data
|       +-- candidates.csv (party, region, name and twitter handles)
|       +-- candidates.json (same + DBPedia URI)
|       +-- candidatesbyparty.json (number of candidates for each party)
|       +-- concepts.json
|       +-- constituencies.json (geoJSON file)
|       +-- councils.json
|       +-- councils.xls
|       +-- euroregions_geojson.json
|       +-- euroregions_topojson.json
|       +-- globalpolls.json (18.05.14 UK-wide polls)
|       +-- londonpolls.json (18.05.14 London-wide polls)
|       +-- midlandspolls.json (18.05.014 Midlands-wide polls)
|       +-- northpolls.json (18.05.14 North-wide polls)
|       +-- parties.json (list of parties with number of candidates and related concepts)
|       +-- partymentions.json (number of mentions since 01.04.14 for each parties)
|       +-- regions.json
|       +-- scotlandpolls.json (18.05.14 Scotland-wide polls)
|       +-- southpolls.json (18.05.14 South-wide polls)
|       +-- topoconstituencies.json
|       +-- uk.json (geojson borders and cities)

```
