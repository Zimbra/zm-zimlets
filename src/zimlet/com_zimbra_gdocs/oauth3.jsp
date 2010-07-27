<%@ page language="java" import="org.apache.commons.httpclient.*" %>
<%@ page language="java" import="org.apache.commons.httpclient.methods.*" %>
<%@ page language="java" import="org.apache.commons.httpclient.methods.multipart.*" %>
<%@ page language="java" import="org.apache.commons.httpclient.cookie.CookiePolicy" %>
<%@ page language="java" import="java.io.InputStream" %>
<%@ page language="java" import="com.zimbra.common.util.StringUtil" %>
<%
    String action = request.getParameter("_action");
    String authHeader = request.getParameter("_auth");
    String url = request.getParameter("_url");
    
    String responseText = "default";
    if(action.equals("reqToken")) {
        String scope = request.getParameter("_scope");
        HttpMethod method = new GetMethod(url);
        String postResponse = null;

        method.setQueryString(new NameValuePair[]{
                                //new NameValuePair("oauth_callback", "oob"),
                                new NameValuePair("scope", scope),
                                new NameValuePair("xoauth_displayname", "Zimbra")
                            });
        
        try {
            HttpClient httpClient = new HttpClient();
            method.setRequestHeader("Authorization", authHeader);
            httpClient.executeMethod(method);

            postResponse = method.getResponseBodyAsString();

            responseText = "{"
                    + "\"success\": true,"
                    + "\"postResponse\": \"" + postResponse + "\","
                    + "\"statusCode\": '" + method.getStatusCode() + "',"
                    + "\"statusText\": '" + method.getStatusText() + "',"
                    + "}";

        }
        catch (Exception e) {
            responseText = "{"
                    + "\"success\": false,"
                    + "\"postResponse\": 'Some error occured "+e.getMessage()+"',"
                    + "}";
        }
        finally {
            method.releaseConnection();
        }
    }

    if(action.equals("accessToken")) {

        String code = request.getParameter("_vc");

        PostMethod method = new PostMethod(url);
        String postResponse = null;

        try {
            HttpClient httpClient = new HttpClient();
            method.setRequestHeader("Authorization", authHeader);

            httpClient.executeMethod(method);

            postResponse = method.getResponseBodyAsString();

            responseText = "{"
                    + "\"success\": true,"
                    + "\"postResponse\": \"" + postResponse + "\","
                    + "\"statusCode\": '" + method.getStatusCode() + "',"
                    + "\"statusText\": '" + method.getStatusText() + "',"
                    + "}";

        }
        catch (Exception e) {
            responseText = "{"
                    + "\"success\": false,"
                    + "\"postResponse\": 'Some error occured "+e.getMessage()+"',"
                    + "}";
        }
        finally {
            method.releaseConnection();
        }
    }

    if(action.equals("docList")) {

        GetMethod method = new GetMethod(url); //+ "?showfolders=true");
        String postResponse = null;
        method.setQueryString(new NameValuePair[]{
                                new NameValuePair("showfolders", "true")
                            });
        
        try {
            HttpClient httpClient = new HttpClient();
            method.setRequestHeader("Authorization", authHeader);

            httpClient.executeMethod(method);

            postResponse = method.getResponseBodyAsString();

            if(method.getStatusCode() == 200) {

                responseText = "{"
                        + "\"success\": true,"
                        + "\"xml\": \"" + StringUtil.jsEncode(postResponse) + "\","
                        + "\"statusCode\": '" + method.getStatusCode() + "',"
                        //+ "\"authHeader\": '" + authHeader + "',"
                        //+ "\"methodLog\": '" + method.toString() + "',"
                        //+ "\"url\": '" + url + "',"
                        + "\"statusText\": '" + method.getStatusText() + "',"
                        + "}";
            }
            else {
                responseText = "{"
                        + "\"success\": false,"
                        + "\"xml\": \"" + StringUtil.jsEncode(postResponse) + "\","
                        + "\"statusCode\": '" + method.getStatusCode() + "',"
                        //+ "\"authHeader\": '" + authHeader + "',"
                        //+ "\"methodLog\": '" + method.toString() + "',"
                        //+ "\"url\": '" + url + "',"
                        + "\"statusText\": '" + method.getStatusText() + "',"
                        + "}";
            }

        }
        catch (Exception e) {
            responseText = "{"
                    + "\"success\": false,"
                    + "\"xml\": 'Some error occured "+e.getMessage()+"',"
                    + "}";
        }
        finally {
            method.releaseConnection();
        }
    }
    if(action.equals("postResource")) {

        GetMethod method = new GetMethod(url); //+ "?showfolders=true");
        String postResponse = null;
        String fileName = request.getParameter("_fid");
        fileName = fileName.replaceAll("\\b\\s{1,}\\b", "");
        MultipartPostMethod postMethod = new MultipartPostMethod("http://localhost:7070/service/upload?fmt=raw&upload=1&fileName="+fileName);
        
        try {
            HttpClient httpClient = new HttpClient();
            method.setRequestHeader("Authorization", authHeader);

            httpClient.executeMethod(method);

            byte[] docResponse = method.getResponseBody();

            PartSource partSource = new ByteArrayPartSource(fileName, docResponse);
            Part filePart = new FilePart(fileName, partSource);
            postMethod.addPart(filePart);

            //Read cookies and set the state
            javax.servlet.http.Cookie[] cookies = request.getCookies();
            org.apache.commons.httpclient.Cookie[] httpClientCookies = this.getHttpClientCookies(cookies);

            String cookieHeader = "";
            for(int i=0; i<httpClientCookies.length; i++) {
                cookieHeader += httpClientCookies[i].toString();
                if(i+1 < httpClientCookies.length) {
                    cookieHeader += ";";
                }
            }

            postMethod.setRequestHeader("Cookie", cookieHeader);
            postMethod.addParameter("fmt", "raw");
            postMethod.addParameter("upload", "1");
            postMethod.addParameter("filename", fileName);

            httpClient.executeMethod(postMethod);
            postResponse = postMethod.getResponseBodyAsString();
            responseText = "{"
                    + "\"success\": true,"
                    + "\"postResponse\": \"" + StringUtil.jsEncode(postResponse) + "\","        
                    + "\"statusCode\": '" + method.getStatusCode() + "',"
                    //+ "\"authHeader\": '" + authHeader + "',"
                    //+ "\"methodLog\": '" + method.toString() + "',"
                    //+ "\"url\": '" + url + "',"
                    + "\"statusText\": '" + method.getStatusText() + "',"
                    + "}";

        }
        catch (Exception e) {
            responseText = "{"
                    + "\"success\": false,"
                    + "\"postResponse\": 'Some error occured "+e.getMessage()+"',"
                    //+ "\"authHeader\": '" + authHeader + "',"
                    //+ "\"methodLog\": '" + method.toString() + "',"
                    //+ "\"url\": '" + url + "',"
                    + "}";
        }
        finally {
            method.releaseConnection();
            postMethod.releaseConnection();
        }
    }
%>
<%=responseText%>
<%!
    private org.apache.commons.httpclient.Cookie[] getHttpClientCookies(javax.servlet.http.Cookie[] cookies) {

        int numberOfCookies =0;
        if(cookies!= null){
            numberOfCookies = cookies.length;
        }
        org.apache.commons.httpclient.Cookie[] httpClientCookies = new org.apache.commons.httpclient.Cookie[numberOfCookies];
        for (int i = 0; i < numberOfCookies; i++) {
            javax.servlet.http.Cookie c = cookies[i];
            String domain = c.getDomain();
            String name = c.getName();
            String value = c.getValue();
            String path = c.getPath();
            boolean secure = c.getSecure();
            int maxAge = c.getMaxAge();
            org.apache.commons.httpclient.Cookie hCookie = new org.apache.commons.httpclient.Cookie(domain, name, value, path, maxAge, secure);
            httpClientCookies[i] = hCookie;
        }
        return httpClientCookies;
    }
%>