# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云(BlueKing) available.
Copyright (C) 2017 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
"""
import uuid

from django.db import models
'''
class TCiEntity(models.Model):
    id = models.AutoField(u"主键ID")

    productTypeId = models.CharField(u"型号主键ID",max_length=100)

    sysName = models.CharField(u"配置项名称",max_length=100)

    statusId = models.IntegerField(u"配置项状态", max_length=11)
    ciCode = models.CharField(u"资产编号", max_length=11)
    name = models.CharField(u"资产别名", max_length=11)
    isMonitor = models.CharField(u"是否监控", max_length=11)

    manageIp = models.CharField(u"管理IP", max_length=11)
    ips = models.CharField(u"IP地址", max_length=11)

    macs = models.CharField(u"Mac地址", max_length=11)
    #是否代理(0. 无代理. 1, 有代理. 2. 未知)
    monitorMode = models.CharField(u"是否代理", max_length=11)

    hostName = models.CharField(u"HOST名称", max_length=11)
    createBy = models.CharField(u"创建人", max_length=11)

    modifyBy = models.CharField(u"修改人", max_length=11)
    devicePrincipal = models.CharField(u"配置项设备负责人", max_length=11)
    #format="yyyy-MM-dd"
    createDate = models.DateField(u"创建时间")
    modifyDate = models.DateField(u"修改时间")

    cisDistrictId = models.CharField(u"行政区域ID", max_length=11)
    sysTypeId = models.CharField(u"系统类型主键ID", max_length=11)

    levelId = models.CharField(u"配置项级别ID", max_length=11)
    deptId = models.CharField(u"所属部门", max_length=11)

    manufacturerId = models.CharField(u"厂商表_厂商ID", max_length=11)
    deviceTypeId = models.CharField(u"设备类型主键id", max_length=11)
    #Y属于存储网，N不是
    isStorage =models.CharField(u"是否属于存储网", max_length=11)

    ciServiceName = models.CharField(u"配置项服务名(包括数据库,中间件等实例名)", max_length=11)
    ciDescribe = models.CharField(u"配置项描述", max_length=11)

    deleteId = models.CharField(u"DELETE_ID", max_length=11)
    isipmi = models.CharField(u"是否支持IPMI(Y/N)", max_length=11)

    ipmiUsername = models.CharField(u"IPMI用户名", max_length=11)
    ipmiPwd = models.CharField(u"IPMI密码", max_length=11)


   
    / ** 是否虚拟资源(Y / N);
    指数据库, 中间件多实例情况;
    Y是虚拟资源则不做统计 * /

    @Excel(name="是否虚拟资源(Y/N) ; 指数据库,中间件多实例情况; Y是虚拟资源则不做统计")

    private
    java.lang.String
    isVirtualRes;
    / ** 是否图形显示(Y / N);
    拓扑图显示中: N则不在拓扑图显示; * /

    @Excel(name="是否图形显示(Y/N);拓扑图显示中: N则不在拓扑图显示;")

    private
    java.lang.String
    isShow;
    / ** IPMI管理IP * /

    @Excel(name="IPMI管理IP")

    private
    java.lang.String
    ipmiManageIp;
    / ** 报废时间 * /

    @Excel(name="报废时间", format="yyyy-MM-dd")

    private
    java.util.Date
    wasteTime;
    / ** 采购时间 * /

    @Excel(name="采购时间", format="yyyy-MM-dd")

    private
    java.util.Date
    buyTime;
    / ** 领用时间 * /

    @Excel(name="领用时间", format="yyyy-MM-dd")

    private
    java.util.Date
    leadTime;
    / ** 入库时间 * /

    @Excel(name="入库时间", format="yyyy-MM-dd")

    private
    java.util.Date
    storageTime;
    / ** 设备到货时间 * /

    @Excel(name="设备到货时间", format="yyyy-MM-dd")

    private
    java.util.Date
    deviceDeliveryTime;
    / ** 投运时间 * /

    @Excel(name="投运时间", format="yyyy-MM-dd")

    private
    java.util.Date
    operationTime;
    / ** 维保结束时间 * /

    @Excel(name="维保结束时间", format="yyyy-MM-dd")

    private
    java.util.Date
    maintenanceStartTime;
    / ** 维保开始时间 * /

    @Excel(name="维保开始时间", format="yyyy-MM-dd")

    private
    java.util.Date
    maintenanceEndTime;
    / ** 机房ID.关联机房表(T_CI_MACHINE_ROOM) * /

    @Excel(name="机房ID.关联机房表(T_CI_MACHINE_ROOM)")

    private
    java.lang.String
    roomId;
    / ** 配置项机房位置 * /

    @Excel(name="配置项机房位置")

    private
    java.lang.String
    ciLocation;
    / ** 配置项服务端口(数据库, 中间件管理端口) * /

    @Excel(name="配置项服务端口(数据库,中间件管理端口)")

    private
    java.lang.String
    ciServicePort;
    / ** 虚拟设备类型主键id * /

    @Excel(name="虚拟设备类型主键id")

    private
    java.lang.String
    vmwareDeviceTypeId;
    / ** 设备型号 * /

    @Excel(name="设备型号")

    private
    java.lang.String
    modelNum;
    / ** 设备序列号 * /

    @Excel(name="设备序列号")

    private
    java.lang.String
    productSerialNum;
    / ** 设备用途 * /

    @Excel(name="设备用途")

    private
    java.lang.String
    useDescribe;
    / ** cmdb存储序列号 * /

    @Excel(name="cmdb存储序列号")

    private
    java.lang.String
    cmdbSerial;
    / ** CQ_ID * /

    @Excel(name="CQ_ID")

    private
    java.lang.String
    cqId;
    / ** CQ_BS_TYPE * /

    @Excel(name="CQ_BS_TYPE")

    private
    java.lang.String
    cqBsType;
    / ** 型号 * /

    @Excel(name="型号")

    private
    java.lang.String
    model;
    / ** 机柜 / 机架号 * /

    @Excel(name="机柜/机架号")

    private
    java.lang.String
    jgno;
    / ** 背板图名称 * /

    @Excel(name="背板图名称")

    private
    java.lang.String
    backplanename;
    / ** 背板图名称 * /

    @Excel(name="背板图名称")

    private
    java.lang.String
    software;
    / ** 联系人 * /

    @Excel(name="联系人")

    private
    java.lang.String
    contactName;
    / ** 告警是否有声音(Y / N) * /

    @Excel(name="告警是否有声音(Y/N)")

    private
    java.lang.String
    alarmvoice;
    / ** 管理端口 * /

    @Excel(name="管理端口")

    private
    java.lang.String
    managerport;
    / ** othersyszone * /

    @Excel(name="othersyszone")

    private
    java.lang.String
    othersyszone;
    / ** contactPerson * /

    @Excel(name="contactPerson")

    private
    java.lang.String
    contactPerson;
    / ** ITSM同步id * /

    @Excel(name="ITSM同步id")

    private
    java.lang.String
    itsmId;
    / ** 协议 * /

    @Excel(name="协议")

    private
    java.lang.String
    accord;
    / ** isKt * /

    @Excel(name="isKt")

    private
    java.lang.String
    isKt;
    / ** 用户组ID * /

    @Excel(name="用户组ID")

    private
    java.lang.String
    ugroupId;
'''
class TCi(models.Model):
    id = models.CharField(primary_key=True, auto_created=True, default=uuid.uuid4, editable=False,max_length=55)
    product_type_id = models.CharField(max_length=96, blank=True, null=True)
    sys_name = models.CharField(max_length=300, blank=True, null=True)
    status_id = models.FloatField(blank=True, null=True)
    ci_code = models.CharField(max_length=150, blank=True, null=True)
    name = models.CharField(max_length=300, blank=True, null=True)
    is_monitor = models.CharField(max_length=3, blank=True, null=True)
    manage_ip = models.CharField(max_length=75, blank=True, null=True)
    ips = models.CharField(max_length=600, blank=True, null=True)
    macs = models.CharField(max_length=600, blank=True, null=True)
    monitor_mode = models.CharField(max_length=150, blank=True, null=True)
    host_name = models.CharField(max_length=120, blank=True, null=True)
    create_by = models.CharField(max_length=96, blank=True, null=True)
    modify_by = models.CharField(max_length=96, blank=True, null=True)
    device_principal = models.CharField(max_length=600, blank=True, null=True)
    create_date = models.DateField(blank=True, null=True)
    modify_date = models.DateField(blank=True, null=True)
    cis_district_id = models.CharField(max_length=96, blank=True, null=True)
    sys_type_id = models.CharField(max_length=96, blank=True, null=True)
    level_id = models.CharField(max_length=96, blank=True, null=True)
    dept_id = models.CharField(max_length=96, blank=True, null=True)
    manufacturer_id = models.CharField(max_length=96, blank=True, null=True)
    device_type_id = models.CharField(max_length=96, blank=True, null=True)
    is_storage = models.CharField(max_length=3, blank=True, null=True)
    ci_service_name = models.CharField(max_length=150, blank=True, null=True)
    ci_describe = models.CharField(max_length=6000, blank=True, null=True)
    delete_id = models.CharField(max_length=3, blank=True, null=True)
    isipmi = models.CharField(max_length=3, blank=True, null=True)
    ipmi_username = models.CharField(max_length=180, blank=True, null=True)
    ipmi_pwd = models.CharField(max_length=180, blank=True, null=True)
    is_virtual_res = models.CharField(max_length=3, blank=True, null=True)
    is_show = models.CharField(max_length=3, blank=True, null=True)
    ipmi_manage_ip = models.CharField(max_length=75, blank=True, null=True)
    waste_time = models.DateField(blank=True, null=True)
    buy_time = models.DateField(blank=True, null=True)
    lead_time = models.DateField(blank=True, null=True)
    storage_time = models.DateField(blank=True, null=True)
    device_delivery_time = models.DateField(blank=True, null=True)
    operation_time = models.DateField(blank=True, null=True)
    maintenance_start_time = models.DateField(blank=True, null=True)
    maintenance_end_time = models.DateField(blank=True, null=True)
    room_id = models.CharField(max_length=96, blank=True, null=True)
    ci_location = models.CharField(max_length=450, blank=True, null=True)
    ci_service_port = models.CharField(max_length=30, blank=True, null=True)
    vmware_device_type_id = models.CharField(max_length=96, blank=True, null=True)
    model_num = models.CharField(max_length=600, blank=True, null=True)
    product_serial_num = models.CharField(max_length=600, blank=True, null=True)
    use_describe = models.CharField(max_length=12000, blank=True, null=True)
    cmdb_serial = models.CharField(max_length=600, blank=True, null=True)
    cq_id = models.CharField(max_length=3000, blank=True, null=True)
    cq_bs_type = models.CharField(max_length=3000, blank=True, null=True)
    model = models.CharField(max_length=600, blank=True, null=True)
    jgno = models.CharField(max_length=600, blank=True, null=True)
    backplanename = models.CharField(max_length=300, blank=True, null=True)
    software = models.CharField(max_length=3000, blank=True, null=True)
    contact_name = models.CharField(max_length=300, blank=True, null=True)
    alarmvoice = models.CharField(max_length=3, blank=True, null=True)
    managerport = models.CharField(max_length=150, blank=True, null=True)
    othersyszone = models.CharField(max_length=3, blank=True, null=True)
    contact_person = models.CharField(max_length=300, blank=True, null=True)
    itsm_id = models.CharField(max_length=300, blank=True, null=True)
    accord = models.CharField(max_length=300, blank=True, null=True)
    is_kt = models.CharField(max_length=3, blank=True, null=True)
    ugroup_id = models.CharField(max_length=96, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 't_ci'


class VCiDenameDeparentname(models.Model):
    id = models.CharField(primary_key=True,  editable=False,max_length=11)
    ci_code = models.CharField(max_length=150, blank=True, null=True)
    sys_name = models.CharField(max_length=300, blank=True, null=True)
    manage_ip = models.CharField(max_length=75, blank=True, null=True)
    belongname = models.CharField(max_length=4000, blank=True, null=True)
    device_principal = models.CharField(max_length=600, blank=True, null=True)

    status_id = models.FloatField(blank=True, null=True)
    name = models.CharField(max_length=300, blank=True, null=True)
    is_monitor = models.CharField(max_length=3, blank=True, null=True)
    cis_district_id = models.CharField(max_length=96, blank=True, null=True)
    level_id = models.CharField(max_length=96, blank=True, null=True)
    deviceparentname = models.CharField(max_length=50, blank=True, null=True)
    devicename = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'v_ci_dename_deparentname'

class TPlanMenu(models.Model):
    id = models.IntegerField(primary_key=True, editable=False, max_length=11)
    pid = models.IntegerField(max_length=11, blank=True, null=True)

    type = models.IntegerField(max_length=1, blank=True, null=True)
    version = models.IntegerField(max_length=11, blank=True, null=True)

    name = models.CharField(max_length=55, blank=True, null=True)
    link = models.CharField(max_length=500, blank=True, null=True)

    menukey = models.CharField(max_length=55, blank=True, null=True)
    createtime = models.DateTimeField(blank=True, null=True)
    tenantId = models.IntegerField(max_length=11, blank=False, null=True)
    iconCls = models.CharField(max_length=55, blank=True, null=True)
    sortIndex = models.IntegerField(max_length=11, blank=True, null=True)


    class Meta:
        managed = False
        db_table = 'PLAT_MENU'


class TPlanDict(models.Model):
    id = models.IntegerField(primary_key=True, editable=False, max_length=11)
    pid = models.IntegerField(max_length=11, blank=True, null=True)

    type = models.IntegerField(max_length=1, blank=True, null=True)

    cnname = models.CharField(max_length=55, blank=True, null=True)

    enname = models.CharField(max_length=55, blank=True, null=True)
    dict_value = models.CharField(max_length=55, blank=True, null=True)
    tenantId = models.IntegerField(max_length=11, blank=False, null=True)
    autoid = models.CharField(max_length=55, blank=True, null=True)
    sysid = models.IntegerField(max_length=11, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'PLAT_DICT'


class TPlatOPERATORLOG(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=11)
    operator_time = models.DateTimeField(blank=True, null=True)

    log_content = models.CharField(max_length=800, blank=True, null=True)
    operator = models.CharField(max_length=55, blank=True, null=True)
    log_level = models.IntegerField(max_length=1, blank=True, null=True)
    ip = models.CharField(max_length=55, blank=True, null=True)

    class_name = models.CharField(max_length=55, blank=True, null=True)
    method_name = models.CharField(max_length=50, blank=True, null=True)
    oper_name = models.CharField(max_length=55, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'WECHAT_OPERATOR_LOG'


class PlatUser(models.Model):
    id = models.BigIntegerField(primary_key=True, editable=False, max_length=11)
    username = models.CharField(max_length=150)
    description = models.CharField(max_length=300, blank=True, null=True)
    tel = models.CharField(max_length=60, blank=True, null=True)
    password = models.CharField(max_length=60, blank=True, null=True)
    fullname = models.CharField(max_length=60, blank=True, null=True)
    address = models.CharField(max_length=60, blank=True, null=True)
    postcode = models.CharField(max_length=60, blank=True, null=True)
    email = models.CharField(max_length=60, blank=True, null=True)
    user_state = models.IntegerField(max_length=1, blank=True, null=True)
    user_key = models.CharField(max_length=60, blank=True, null=True)
    gender = models.BigIntegerField()
    isdeleted = models.IntegerField(max_length=1, blank=True, null=True)
    comfirm_method = models.IntegerField(max_length=1, blank=True, null=True)
    idcard_no = models.CharField(max_length=60, blank=True, null=True)
    reg_time = models.DateTimeField(blank=True, null=True)
    office_tel = models.CharField(max_length=60, blank=True, null=True)
    block_up_time = models.DateTimeField(blank=True, null=True)
    is_start_up = models.IntegerField(max_length=1, blank=True, null=True)
    loginnum = models.BigIntegerField()
    createtime = models.DateTimeField(blank=True, null=True)
    ulevel = models.IntegerField(max_length=1, blank=True, null=True)
    type = models.IntegerField(max_length=1, blank=True, null=True)
    tel2 = models.CharField(max_length=60, blank=True, null=True)
    sign = models.CharField(max_length=60, blank=True, null=True)
    lastupdate = models.DateTimeField(blank=True, null=True)
    cnname = models.CharField(max_length=60, blank=True, null=True)
    qq = models.CharField(max_length=60, blank=True, null=True)
    position = models.CharField(max_length=60, blank=True, null=True)
    link = models.CharField(max_length=60, blank=True, null=True)
    age = models.BigIntegerField()
    autoid = models.CharField(max_length=60, blank=True, null=True)
    comid = models.BigIntegerField()
    wx = models.CharField(max_length=60, blank=True, null=True)
    tenantId = models.IntegerField(max_length=11, blank=False, null=True)
    version = models.IntegerField(max_length=11, blank=False, null=True)

    class Meta:
        managed = False
        db_table = 'PLAT_USER'


class PlatDept(models.Model):
    dept_id = models.BigIntegerField(primary_key=True, editable=False, max_length=11)
    dept_name = models.CharField(max_length=150)
    description = models.CharField(max_length=300, blank=True, null=True)
    tel = models.CharField(max_length=60, blank=True, null=True)
    manager = models.CharField(max_length=60, blank=True, null=True)
    dept_type = models.IntegerField(max_length=1, blank=True, null=True)
    pid = models.BigIntegerField()
    isdeleted = models.IntegerField(max_length=1, blank=True, null=True)
    createtime = models.DateTimeField(blank=True, null=True)
    tenantId = models.IntegerField(max_length=11, blank=False, null=True)
    version = models.IntegerField(max_length=11, blank=False, null=True)
    autoid = models.CharField(max_length=55, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'PLAT_DEPT'


class PlatRole(models.Model):
    id = models.BigIntegerField(primary_key=True, editable=False, max_length=11)
    rolename = models.CharField(max_length=165, blank=True, null=True)
    title = models.CharField(max_length=165, blank=True, null=True)
    description = models.CharField(max_length=765, blank=True, null=True)
    tenantid = models.IntegerField(blank=True, null=True)
    version = models.IntegerField(blank=True, null=True)
    isroot = models.NullBooleanField()
    isadmin = models.NullBooleanField()
    autoid = models.CharField(max_length=165, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'plat_role'


class PlatDeptType(models.Model):
    dept_type = models.IntegerField()
    dept_typename = models.CharField(max_length=60, blank=True, null=True)
    isdeleted = models.IntegerField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'PLAT_DEPT_TYPE'
