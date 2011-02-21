<!--
 * ***** BEGIN LICENSE BLOCK *****
 * 
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Zimbra Public License
 * Version 1.3 ("License"); you may not use this file except in
 * compliance with the License.  You may obtain a copy of the License at
 * http://www.zimbra.com/license.
 * 
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * 
 * ***** END LICENSE BLOCK *****
-->
<%@ page
import="org.apache.commons.fileupload.*,org.apache.commons.fileupload.servlet.ServletFileUpload,org.apache.commons.fileupload.disk.DiskFileItemFactory,org.apache.commons.io.FilenameUtils,java.util.*,java.io.File,java.lang.Exception,sun.misc.BASE64Decoder,org.apache.commons.httpclient.methods.*,org.apache.commons.httpclient.methods.multipart.*,org.apache.commons.httpclient.*" %>


<%
	if (ServletFileUpload.isMultipartContent(request)) {
		ServletFileUpload servletFileUpload = new ServletFileUpload(
		new DiskFileItemFactory());
		List fileItemsList = servletFileUpload.parseRequest(request);

		String optionalFileName = "";
		FileItem fileItem = null;
		String version = request.getParameter("version");
		String api_key = request.getParameter("api_key");
		String name = request.getParameter("name");
		String drop_name = request.getParameter("drop_name");
		String token = request.getParameter("token");
		String proxyON = request.getParameter("proxyON");
		String pHost = request.getParameter("pHost");
		String pPort = request.getParameter("pPort");

		Iterator it = fileItemsList.iterator();
		while (it.hasNext()) {
			fileItem = (FileItem) it.next();
			if (fileItem != null && !fileItem.isFormField()) {
				File saveTo = File.createTempFile("dropioZimlet_", fileItem.getName());
				fileItem.write(saveTo);
				FilePart fimgpart = new FilePart("file", fileItem.getName(), saveTo);
				fimgpart.setTransferEncoding(null);

				PostMethod filePost = new PostMethod("https://assets.drop.io/upload?format=json");
				Part[] parts = {
				new StringPart("version", version),
				new StringPart("api_key", api_key),
				new StringPart("drop_name", drop_name),
				new StringPart("name", "file"),
				new StringPart("token", token),
				fimgpart
				};
				filePost.setRequestEntity(new MultipartRequestEntity(parts, filePost.getParams()));

				HttpClient client = new HttpClient();
				if (proxyON.equals("true")) {
					client.getHostConfiguration().setProxy(pHost, Integer.parseInt(pPort));
				}
				int status = client.executeMethod(filePost);
				String str = filePost.getResponseBodyAsString();
				saveTo.deleteOnExit();
				filePost.releaseConnection();

%>

<%=str%>

<%
			}
		}
	}
%>

