![alt tag](https://raw.githubusercontent.com/basilesimon/EU-elections-2014/master/src/sreenshot-readme.png)
#EU-elections-2014

Unnecessary exploration of the 2014 European election in the UK.

######Disclaimer
This content is not published by BBC News and must not be considered as BBC words.

####To-do
######Basile le Simon
- [ ] Graph of candidates' number of occurrences over time
    - [x] Build the query with News Labs API
    - [ ] Store the results to be used with Chart.js
- [x] Model dashboard
- [ ] Infos we want to return for candidates from DBPedia

######Iain Herr Collins
- [x] Tell le Basile how to get the number of occurrences for a concept
- [ ] Have a nice map... that actually gives results
    - [x] Use unique IDs for European constituencies
    - [ ] Separate SVG data in another doc to make ```map.html``` easier to work on?
- Candidates map:
    - [x] Clicks must display a list of the candidates
    - [ ] Only display candidates we have infos on
    - [ ] Clicking on a candidate must display infos about him
        - [ ] Which infos do we want to use? See Basile
- News map: 
    - [ ] Clicking on an article displays greyed box with article description
- Nav: 
    - [ ] Flattened list on landing screen with section titles
    - [ ] Nav sticks to top (under BBC masthead) when scrolling
####Ideas
- Dashboard to follow the elections
- Highlight the different media coverages the parties and candidates receive
- Find patterns in the data
- Provide background info *after* the election
    - Enter your postcode and find out more about your elected MEP
