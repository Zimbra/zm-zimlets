<!-- 
***** BEGIN LICENSE BLOCK *****
Version: ZPL 1.1

The contents of this file are subject to the Zimbra Public License
Version 1.1 ("License"); you may not use this file except in
compliance with the License. You may obtain a copy of the License at
http://www.zimbra.com/license

Software distributed under the License is distributed on an "AS IS"
basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
the License for the specific language governing rights and limitations
under the License.

The Original Code is: Zimbra Collaboration Suite Web Client

The Initial Developer of the Original Code is Zimbra, Inc.
Portions created by Zimbra are Copyright (C) 2006 Zimbra, Inc.
All Rights Reserved.

Contributor(s):

***** END LICENSE BLOCK *****
-->

<%@ page language="java" import="java.io.*, java.util.*, javax.naming.*"%>
<%
	String name = (String) request.getParameter("name");
	String path = (String) request.getParameter("path");
	String subject = (String) request.getParameter("subject");
	String id = (String) request.getParameter("id");
	PrintWriter pw = response.getWriter();
    if (name == null) 
	    pw.println("id=" + id + "; subject=" + subject);
	else 
		pw.println("name=" + name + "; path=" + path); 
%>
