/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014 Zimbra, Inc.
 * 
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software Foundation,
 * version 2 of the License.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 * ***** END LICENSE BLOCK *****
 */
package com.zimbra.cs.taglib;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspTagException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.tagext.BodyTagSupport;

import com.zimbra.common.account.Key;
import com.zimbra.common.service.ServiceException;
import com.zimbra.cs.account.Account;
import com.zimbra.cs.account.AuthToken;
import com.zimbra.cs.account.AuthTokenException;
import com.zimbra.cs.account.Provisioning;
import com.zimbra.cs.mailbox.OperationContext;
import com.zimbra.cs.service.AuthProvider;

public class ZimbraTag extends BodyTagSupport {

    /**
     * Override getContentStart and getContentEnd
     */
    public String getContentStart(Account acct, OperationContext octxt) throws ZimbraTagException, ServiceException {
        return "";
    }

    public String getContentEnd(Account acct, OperationContext octxt) throws ZimbraTagException, ServiceException {
        return "";
    }

    private AuthToken getAuthToken() throws ZimbraTagException, ServiceException {
        HttpServletRequest req = (HttpServletRequest)pageContext.getRequest();

        AuthToken token = null;
        try {
            token = AuthProvider.getAuthToken(req, false);
            if (token == null)
                throw ZimbraTagException.AUTH_FAILURE("no auth cookie");
        } catch (AuthTokenException ate) {
            throw ZimbraTagException.AUTH_FAILURE("cannot parse authtoken");
        }

        if (token.isExpired()) {
            throw ZimbraTagException.AUTH_FAILURE("authtoken expired");
        }

        if(!token.isRegistered()) {
            throw ZimbraTagException.AUTH_FAILURE("authtoken is invalid");
        }
        return token;
    }

    private Account getRequestAccount(AuthToken token) throws ZimbraTagException, ServiceException {
    	Provisioning prov = Provisioning.getInstance();
        Account acct = prov.get(Key.AccountBy.id, token.getAccountId(), token);
        if (acct == null) {
        	throw ZimbraTagException.AUTH_FAILURE("account not found "+token.getAccountId());
        }
        return acct;
    }

    @Override
    public int doStartTag() throws JspTagException {
        try {
            AuthToken authToken = getAuthToken();
            Account acct = getRequestAccount(authToken);
            OperationContext octxt = new OperationContext(acct);

            String content = getContentStart(acct, octxt);
            if (content.length() > 0) {
                JspWriter out = pageContext.getOut();
                out.print(content);
            }
        } catch (IOException ioe) {
        	throw ZimbraTagException.IO_ERROR(ioe);
        } catch (ServiceException se){
        	throw ZimbraTagException.SERVICE_ERROR(se);
        }
        return SKIP_BODY;
    }

    @Override
    public int doEndTag() throws JspTagException {
        try {
            AuthToken authToken = getAuthToken();
            Account acct = getRequestAccount(authToken);
            OperationContext octxt = new OperationContext(acct);

            String content = getContentEnd(acct, octxt);
            JspWriter out = pageContext.getOut();
            out.print(content);
        } catch (IOException ioe) {
        	throw ZimbraTagException.IO_ERROR(ioe);
        } catch (ServiceException se){
        	throw ZimbraTagException.SERVICE_ERROR(se);
        }
        return EVAL_PAGE;
    }
}
