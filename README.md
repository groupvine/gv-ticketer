# gv-ticketer
GroupVine Ticketing Utility

## Example Usage (in Typescript)

Generate a ticket:

```
import {Ticketer}         from 'ticketer';

let ticketer = new Ticketer();

let tktDate  = ticketer.dateSeed(new Date());
let ticket   = ticketer.ticket(tktBody, tktDate);
```

Validate a ticket:

```
import {Ticketer}         from 'ticketer';

let ticketer = new Ticketer();

if (tickter.validate(ticket, tktBody, tktDate)) {
    ...
}
```
