

from simple_salesforce import Salesforce,SFType
import simple_salesforce
import sys
import json
import configparser, os, distutils
def sf_exec(env,query): 
    
    response={}
    qry_list=query.split()
    print qry_list[0]
    
    if(qry_list[0].lower()=="$describe" or qry_list[0].lower()=="$desc"or qry_list[0].lower()=="describe" or qry_list[0].lower()=="desc"):
        print "hello"
        response=sf_tbl_detail(env,qry_list[1].lower())
        
    else:
        [err,err_msg,sf]=sf_conn(env)
        if (err == 0):
            try:
                s= sf.query(query)
                table_postition=[i for i,val in enumerate(query.split()) if val.upper() == "FROM"]
                table=query.split()[table_postition[0] + 1 ]
                #print(table)
                qRows=s['totalSize']
                qResultset=[value for value in s['records']]
                #print(type(qResultset))
                full_col_header=[]
                full_col_values=[]
                for i,j in enumerate(qResultset):
                    del j['attributes']
                    col_values=[]
                    for (key,value) in j.items():
                        if i==0:
                            col_header=[]
                            col_header.append(key)
                            full_col_header.append(col_header)
                        col_values.append(value)
                    full_col_values.append(col_values)
                #print full_col_values
                response["table"]=table
                response["columns"]=full_col_header
                response["data"]=full_col_values
                response["qRows"]=qRows
                if (qRows == 0):
                    response["error"]=1
                    response["error_msg"]="Record not available"
                else:
                    response["error"]=0
                    response["error_msg"]=""
            except:
                response["table"]=""
                response["columns"]=""
                response["data"]=""
                response["error"]=1
                response["qRows"]=0
                print(str(sys.exc_info()[1]).split("Response content")[1][1:])
                msg  = str(sys.exc_info()[1]).split("Response content")[1][1:]
                err = str(msg).split("'errorCode':")[1].split("'message'")[0].split(",")[0][3:-1]
                err_msg = str(msg).split("'errorCode':")[1].split("'message'")[1].split("Column:")[1].split('\\n')[1][:-3]
                print(msg)  
                response["error_msg"]= "Error: " + err +  "\n" + "Message: " + err_msg 
        else :
            response["table"]=""
            response["columns"]=""
            response["data"]=""
            response["error"]=err
            response["qRows"]=0
            response["error_msg"]=err_msg
    return (response)



def sf_tbl_detail(env,tblname): 
    response={}
    [err,err_msg,sf]=sf_conn(env)
    if (err == 0):
        try:
            obj=SFType(tblname,sf.session_id,sf.sf_instance , sf.sf_version)
            lst_meta=(obj.metadata()).get('objectDescribe')
            ord_dict=obj.describe()
            full_col_header=['ColumnName', 'Label','datatype','length,precision','IsUpdateable','IsNullable','restrictedPicklist']
            full_col_values = [[field["name"],field["label"],field["type"],str(field["length"])+','+str(field["precision"]),bool_convert(field["updateable"]) ,bool_convert(field["nillable"]),bool_convert(field["restrictedPicklist"])] for field in ord_dict["fields"] ]
            response["table"]=tblname
            response["columns"]=full_col_header
            response["data"]=full_col_values
            response["error"]=0
            response["qRows"]=0
            response["error_msg"]=""
        except :
            response["table"]=""
            response["columns"]=""
            response["data"]=""
            response["error"]=1
            response["qRows"]=0
            response["error_msg"]=str(sys.exc_info()[1]).split("Response content")[1][1:]
    else :
        response["table"]=""
        response["columns"]=""
        response["data"]=""
        response["error"]=err
        response["qRows"]=0
        response["error_msg"]=err_msg
    return (response)


def sf_tbl_desc(env,tblname): 
    response={}
    [err,err_msg,sf]=sf_conn(env)
    
    if (err == 0):
        try:
            obj=SFType(tblname,sf.session_id,sf.sf_instance , sf.sf_version)
            lst_meta=(obj.metadata()).get('objectDescribe')
            ord_dict=obj.describe()
            col_lst=ord_dict.get('fields')
            column_names=[field["name"].lower() for field in col_lst]
            response["error"]=0
            response["error_msg"]=""
            response["column_names"]= column_names 
        except:
            response["error"]=1
            response["qRows"]=[]
            response["error_msg"]=str(sys.exc_info()[1]).split("Response content")[1][1:]
    else :
        response["error"]=err
        response["column_names"]=[]
        response["error_msg"]=err_msg
    return (response)


def replace_comma(instr):
    newstr=""
    comma_count=0
    for i in instr:
        if (i==","):
            comma_count+=1
            if(comma_count%8==0):
                i=",\n"
        newstr=newstr+i

    return(newstr.replace(" from ",' \nfrom '))	

def bool_convert(val):
    return ('Y' if val else 'N')

def sf_conn(env):
    response={}
    file_path = os.path.dirname(os.path.realpath(__file__))
    config_file_name = file_path + '/config.ini'
    try:
        config = configparser.ConfigParser()
        if not(os.path.isfile(config_file_name)):
            err=1
            sf=""
            error_msg="config.ini file is not avaialble in querya folder"
        else:
            config.read(config_file_name)
            if env in config:
                try:
                    sandbox = bool(config[env]['sandbox'])
                except:
                    sandbox = False
                sf = Salesforce(username=config[env]['username'], password=config[env]['password'], security_token=config[env]['security_token'], sandbox=sandbox)
                err=0
                error_msg=""
            else:
                err=1
                error_msg="Given environment value is not present in config file"
                sf=""
    
    except :
        err=1
        sf=""
        error_msg=str(sys.exc_info()[1]).split("Response content")[1][1:]
            
    return ([err,error_msg,sf])

def wsdl_table_list():
    [err,err_msg,sf]= sf_conn('dev')
    # [err,err_msg,sf]= sf_conn(<Any one of the environment give in config file>))
    table_list = [x['name'] for x in sf.describe()["sobjects"] if not x['name'].endswith('__Tag')]
    return table_list
