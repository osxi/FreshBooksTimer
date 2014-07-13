FreshBooks Timer
----------------------------------
v0.0.0

### Status Update

I was using this for awhile without any problems until recently when I reinstalled it and it wouldn't work for some reason. I plan on either remaking this from scratch or fixing it. I don't have a timeline on this right now though.

Track development on Trello: [FreshBooks Timer Board](https://trello.com/b/VlS3lADH)

![Imgur](http://i.imgur.com/82TuRqN.jpg)

## Description:

A chrome extension for tracking time with FreshBooks through their API.

It allows you to track time and submit it through a browser action button. If
you open it while on a Trello card it will prepopulate the notes with the title
of the card. Since I use Trello that is what I will be focusing on, but if
someone wants to provide a similar feature on another project management tool
that's completely welcome.

It relies on a node proxy to the FreshBooks API which prevents me from having
to mess with their xml api directly. It's running on a free Heroku instance and
it's also open source and can be found
[https://github.com/jakecraige/FreshBooksApiProxyNode](https://github.com/jakecraige/FreshBooksApiProxyNode)

## Installation

### Stable*(not ready yet)*

### Development

1. `git clone https://github.com/jakecraige/FreshBooksTimer.git`
2. Open Chrome, and browse to your extensions list at `chrome://extensions`
3. Check the 'Developer mode' checkbox
4. Click 'Load unpacked extension'
5. Find the folder you just cloned and go to then app folder
6. Click save

## Setup

1. Right click the FreshBooks Timer browser button and click options
2. Enter your api url and auth token: [how to get authentication
   token](http://community.freshbooks.com/support/what-is-my-authentication-token-api-and-where-can-i-get-it/)
3. Go to the import data and click "Import all". (it may take a little
   longer for the first one since it will likely have to boot up the heroku
   instance)
4. Reload the page and go to the defaults tab
5. Set your default options that will show up when you open the extension
   popup

## Usage

### Invoking the FreshBooks Timer extension

1. Clicking the FreshBooks Timer browser button
2. Fill in whatever information you would like
3. Click start
4. When you want to submit your time to FreshBooks, click save

===========================
Copyright (c)2014 Poetic
Distributed under MIT license
