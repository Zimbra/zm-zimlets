/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2005, 2006, 2007, 2009, 2010, 2013, 2014 Zimbra, Inc.
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

import java.util.List;

import com.zimbra.common.service.ServiceException;
import com.zimbra.cs.account.Account;
import com.zimbra.cs.mailbox.Mailbox;
import com.zimbra.cs.mailbox.MailboxManager;
import com.zimbra.cs.mailbox.OperationContext;

public class Conversation extends Message {
    private static final long serialVersionUID = -2306183433671648674L;

    String mIndex;

    public void setIndex(String val) {
        mIndex = val;
    }

    public String getIndex() {
        return mIndex;
    }

    public String getContentStart(Account acct, OperationContext octxt) throws ZimbraTagException, ServiceException {
        if (mId == null) {
            throw ZimbraTagException.MISSING_ATTR("id");
        }
        if (mField == null) {
            throw ZimbraTagException.MISSING_ATTR("field");
        }
        if (mIndex == null) {
            throw ZimbraTagException.MISSING_ATTR("index");
        }
        int cid = Integer.parseInt(mId);
        int index = Integer.parseInt(mIndex);
        Mailbox mbox = MailboxManager.getInstance().getMailboxByAccountId(acct.getId());
        List<com.zimbra.cs.mailbox.Message> msgs = mbox.getMessagesByConversation(octxt, cid);
        return getMessageContent(msgs.get(index));
    }
}
