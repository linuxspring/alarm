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
import json

from django.core import serializers
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage

from common.mymako import render_mako_context,render_json
from home_application.models import VCiDenameDeparentname

def home(request):
    """
    首页
    """
    return render_mako_context(request, '/home_application/home.html')


def dev_guide(request):
    """
    开发指引
    """
    return render_mako_context(request, '/home_application/dev_guide.html')


def contactus(request):
    """
    联系我们
    """
    return render_mako_context(request, '/home_application/contact.html')

def hello(request):
    """
    联系我们
    """
    return render_mako_context(request, '/home_application/hello.html')

def ciLict(request):

    tciList = VCiDenameDeparentname.objects.all()

    ci_code = request.GET.get('ci_code')
    sys_name = request.GET.get('sys_name')
    manage_ip = request.GET.get('manage_ip')
    belongname = request.GET.get('belongname')
    parent_child_name = request.GET.get('parent_child_name')

    device_principal = request.GET.get('device_principal')
    status_id = request.GET.get('status_id')
    name = request.GET.get('name')
    is_monitor = request.GET.get('is_monitor')
    cis_district_id = request.GET.get('cis_district_id')
    level_id = request.GET.get('level_id')

    if not ci_code is None and  not ci_code == "":
        tciList = tciList.filter(ci_code__contains=ci_code)  # 名称中包含 "abc"的人
    if not sys_name is None and not sys_name == "":
        tciList = tciList.filter(sys_name__contains=sys_name)  # 名称中包含 "abc"的人
    if not manage_ip is None and not manage_ip == "":
        tciList = tciList.filter(manage_ip__contains=manage_ip)  # 名称中包含 "abc"的人
    if not belongname is None and not belongname == "":
        tciList = tciList.filter(belongname=belongname)  # 归属业务系统
    if not parent_child_name is None and not parent_child_name == "":
        tciList = tciList.filter(parent_child_name=parent_child_name)  # 配置型类别


    if not device_principal is None and  not device_principal == "":
        tciList = tciList.filter(device_principal=device_principal)  # 配置项责任人
    if not status_id is None and not status_id == "":
        tciList = tciList.filter(status_id=status_id)  # 配置项状态
    if not name is None and not name == "":
        tciList = tciList.filter(name__contains=name)  # 设备别名
    if not is_monitor is None and not is_monitor == "":
        tciList = tciList.filter(is_monitor=is_monitor)  # 是否监控
    if not cis_district_id is None and not cis_district_id == "":
        tciList = tciList.filter(cis_district_id=cis_district_id)  # 行政区域
    if not level_id is None and not level_id == "":
        tciList = tciList.filter(level_id=level_id)  # 配置项级别

    tciList=tciList.extra(select={'parent_child_name': "deviceparentname||'/'||devicename"})

    size = request.GET.get('size',10)
    paginator = Paginator(tciList, size)  # Show 25 contacts per page

    page = request.GET.get('page')
    try:
        tciList = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        tciList = paginator.page(1)
        page =1
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        tciList = paginator.page(paginator.num_pages)
        page = paginator.num_pages



    #转字符串，把对象拿出来。
    json_data = serializers.serialize("json", tciList, ensure_ascii=False)#只有数据没页码

    result = {'page':page,'size':size,'rows':json.loads(json_data)}

    return render_json(result)
