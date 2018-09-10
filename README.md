
## Overview
Saleforce Query Assistant is an open source web based application built using Django and Simple_salesforce API to run Salesforce Queries(SOQL).

Please refer the [UI Overview](https://github.com/magesh83/sf_query_assistant/blob/master/README.md#ui-overview) section below to view the Web portal.


## Project Setup

#### Requirements: Python & Pip
   

### Initial setup for Windows:

Create a new directory and CD to the new directory.

#### git pull:

Git hub link :[Salesforce Query Assitant](hhttps://github.com/magesh83/sf_query_assistant.git)

Click Clone or Download button and Download [ZIP](https://github.com/magesh83/sf_query_assistant/archive/master.zip)
 
Unzip the file to any location.

Open Command window and CD to the unzipped path

#### Install required packages:

```
pip install -r requirements.txt
```

Copy the Configuration file and make the edits

```
copy ".\salesforce_query_assist\querya\config_change.ini" ".\salesforce_query_assist\querya\config.ini"
```

### Initial setup for Mac:

Create a new directory and CD to the new directory.

#### git pull:

```
git clone https://github.com/magesh83/sf_query_assistant.git
```

#### Install required packages:

```
cd sf_query_assistant
pip install -r requirements.txt
```

Copy the Configuration file and make the edits

```
cp ./salesforce_query_assist/querya/config_change.ini ./salesforce_query_assist/querya/config.ini
```


### Setup common for Windows and Mac:
Edit the file `./salesforce_query_assist/querya/config.ini `

Modify the Salesforce connectivity details without single quote or double quotes.

```
[dev] # This is the name that is displayed in Environment section in the screenshot.
username=<Salesforce user name>
password=<Saleforce password>
security_token=<Salesforce token>
sandbox=<True or False>

e.g

[dev] 
username=abc@abc.com
password=abcdefg
security_token=rtrt4242f
sandbox=False
```

Add all the Salesforce environments which needs to be accessed through the portal.
Atleast one connection setting should have the env name as __dev__, 
If there is no env with the name `dev` then you need to edit the file 
`./salesforce_query_assist/querya/soql.py` and make the change from __dev__ to the __new name__ in the function `def wsdl_table_list()`.

#### Adding secret key to the project:
Generate Django Secret Key from the portal https://www.miniwebtool.com/django-secret-key-generator
and copy it.

Edit the file
`./salesforce_query_assist/salesforce_query_assist/settings.py`

and paste the value in the line
```
SECRET_KEY = ''
```

#### SQLite setup commands:


```
cd ./salesforce_query_assist
python manage.py makemigrations
python manage.py makemigrations querya
python manage.py migrate
```


#### Create super user:

```
python manage.py createsuperuser
```

That's all, set up is finished.

#### Start the server:

```
python manage.py runserver 
```

If everything was set properly, the server will give the following message

```
Django version 1.11.1, using settings 'salesforce_query_assist.settings'
Quit the server with CONTROL-C.
```
To View the application, go to: [http://localhost:8000/soql](http://localhost:8000/soql)

To start the server in network

```
 python manage.py runserver 0.0.0.0:8088

```

In the network machine you can use your IP address to connect the portal 
```
http://<ipaddress>:8088/soql
```

In the login page use the username, password created in superuser step above  or create a new user and access salesforce.
#### Cheers.

## UI Overview

### Query tab:

![Query]()

### History:

![History]()

### Answerset:

![Answerset]()


