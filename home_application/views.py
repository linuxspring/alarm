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
from home_application.models import TCi

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

    tciList = TCi.objects.all()

    ciCode = request.GET.get('ciCode')
    if not ciCode is None and  not ciCode == "":
        tciList.filter(ci_code__contains=ciCode)  # 名称中包含 "abc"的人


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
