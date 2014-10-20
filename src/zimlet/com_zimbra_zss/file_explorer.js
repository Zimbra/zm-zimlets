function com_zimbra_zss_Explorer(initObj) {
	this.rootContainer = initObj.rootContainer;
	this.isFolderExplorer = initObj.isFolderExplorer;

	this.mezeoServerPath = initObj.vaultPath;
	this.parentDialog = initObj.dialog;
	
	this.noFilesMsg = initObj.noFilesMsg;
	this.fetchingContentMsg = initObj.fetchingContentMsg;
	this.refreshFolderBtnText = initObj.refreshFolderBtnText;

	this.selectedItems = [];

	this._initUI();
	this._addEventHandlers();
	//Mezeo content related to the item stored here
	this.dataKey = "mezeoContent";
	//Prevent fetching of data again on clicking the header again
	this.dataFetched = "dataFetched";
	this.mezeoCache = {};

	this.loadRootContainer();
}

com_zimbra_zss_Explorer.prototype._initUI = 
function() {
	this._createHtml();

	this.refreshButton = new DwtButton({
								parent: this.rootContainer,
								className: "zss-refresh-button"
							});
	this.refreshButton.setText(this.refreshFolderBtnText);
	this.refreshButton.setImage("Refresh");
	this.refreshButton.reparentHtmlElement(document.getElementById(this._refreshButtonTreeCellId));

	this.folderExplorer = new DwtTree({
		parent: this.rootContainer,
		className: "zss-folder-explorer"
	});
	this.folderExplorer.reparentHtmlElement(document.getElementById(this._folderTreeCellId));

	this.fileExplorer = new DwtTree({
		parent: this.rootContainer,
		posStyle: DwtControl.RELATIVE_STYLE,
		className: "zss-file-explorer",
		style: (this.isFolderExplorer ? DwtTree.SINGLE_STYLE : DwtTree.CHECKEDITEM_STYLE)
	});
	this.fileExplorer.reparentHtmlElement(document.getElementById(this._fileTreeCellId));	

	//Add a dummy file to prevent the file explorer td from collapsing
	this._addGhostFile();

	//Cache elements 
	this._fileFolderTreeContainer = document.getElementById(this._treeWrapperTableId);
	this._folderTreeWrapper = document.getElementById(this._folderTreeCellId);
	this._fileTreeWrapper = document.getElementById(this._fileTreeCellId);

	//Adjust the heights of the trees to prevent collapse on FF.
	this._adjustTreeHeights();
};

com_zimbra_zss_Explorer.prototype._addEventHandlers = function(){
	this.folderExplorer.addSelectionListener(new AjxListener(this, this._folderTreeViewListener));
	this.fileExplorer.addSelectionListener(new AjxListener(this, this._fileTreeViewListener));
	this.refreshButton.addSelectionListener(new AjxListener(this, this._refreshFolders));
}

com_zimbra_zss_Explorer.prototype._adjustTreeHeights = function(){
	//Set Element Height
	var containerDimensions = this.rootContainer.getSize();
	var availableContentHeight = containerDimensions.y;
	
	var height = this.isFolderExplorer ? availableContentHeight - 20 : availableContentHeight - 42;
	
	this._fileFolderTreeContainer.style.height = height + "px";
	this._folderTreeWrapper.style.height = height + "px";
	this._fileTreeWrapper.style.height = height + "px";
}

com_zimbra_zss_Explorer.prototype._adjustTreeWidths = function(){
	var containerDimensions = this.rootContainer.getSize(),
		availableContentWidth = containerDimensions.x;
	this.folderExplorer.setSize(availableContentWidth * .32, this._folderTreeWrapper.style.height);
	this.fileExplorer.setSize(availableContentWidth * .68, this._fileTreeWrapper.style.height);
}

com_zimbra_zss_Explorer.prototype._addGhostFile = function(){
	this._addTreeItem({
		className: "zss-ghost-file DwtTreeItem",
		name: "",
		path: "",
		type: this.MEZEO_FILE,
		icon: "",
		content: ""
	}, this.fileExplorer);
}

// FETCHING CONTENTS NOTIFICATION HELPERS
com_zimbra_zss_Explorer.prototype._showFetchContentsNotification = function(){
	$('.zss-file-explorer').append('<div class="zss-loader"><span>' + this.fetchingContentMsg + '</span></div>');
}
com_zimbra_zss_Explorer.prototype._hideFetchContentsNotification = function(){
	$('.zss-file-explorer .zss-loader').remove();
}
//END FETCHING CONTENTS HELPER

// FETCHING CONTENTS NOTIFICATION HELPERS
com_zimbra_zss_Explorer.prototype._showNoFilesFoundMessage = function(){
	$('.zss-file-explorer').append('<div class="zss-no-result"><span>' + this.noFilesMsg + '</span></div>');
}
com_zimbra_zss_Explorer.prototype._hideNoFilesFoundMessage = function(){
	$('.zss-file-explorer .zss-no-result').remove();
}
//END FETCHING CONTENTS HELPER

com_zimbra_zss_Explorer.prototype._createHtml = function() {
	this._treeWrapperTableId = Dwt.getNextId();
	this._folderTreeCellId = Dwt.getNextId();
	this._fileTreeCellId = Dwt.getNextId();
	this._refreshButtonTreeCellId = Dwt.getNextId();

	var html = [];
	var idx = 0;
	var wrapperCssClass = this.isFolderExplorer? "is-chooseFolderMode" : "";	
	
	html[idx++] = '<table id="' + this._treeWrapperTableId + '" class="zss-tree-container ' + wrapperCssClass + '" width="100%">';
	html[idx++] = '<tr>';
	html[idx++] = '<td valign="top" id="' + this._refreshButtonTreeCellId + '">';
	html[idx++] = '</td>';
	html[idx++] = '</tr>';
	html[idx++] = '<tr>';
	html[idx++] = '<td valign="top" id="' + this._folderTreeCellId + '">';
	html[idx++] = '</td>';
	html[idx++] = '<td  valign="top"  id="' + this._fileTreeCellId + '">';
	html[idx++] = '</td>';
	html[idx++] = '</tr>';
	html[idx++] = '</table>';

    this.rootContainer.setContent(html.join(""));
}

com_zimbra_zss_Explorer.prototype.MEZEO_CONTAINER = "MEZEO_CONTAINER";
com_zimbra_zss_Explorer.prototype.MEZEO_FILE = "MEZEO_FILE";

com_zimbra_zss_Explorer.prototype._refreshFolders = function(){
	this.folderExplorer.clearItems();
	this._clearTreeItems(this.fileExplorer);
	this.selectedItems = [];
	this.mezeoCache = {};
	this.loadRootContainer();
};

com_zimbra_zss_Explorer.prototype.loadRootContainer = function() {
	this._showFetchContentsNotification();
	this.queryServer(this.mezeoServerPath + '/v2',new AjxCallback(this, this.displayRootContainerContents));
}

com_zimbra_zss_Explorer.prototype._fileTreeViewListener  = function(ev){
	var selectedItem = ev.item;
	var data = selectedItem.getData(this.dataKey);

	if(ev.detail === DwtTree.ITEM_CHECKED) {
		this.onSelectItem(data, selectedItem.getChecked());
	}
}

com_zimbra_zss_Explorer.prototype._folderTreeViewListener  = function(ev){
	var selectedItem = ev.item;
	var data = selectedItem.getData(this.dataKey);

	if(ev.detail === DwtTree.ITEM_SELECTED ) {
		if(this.isFolderExplorer) {
			this.onSelectItem(data, true);
		}
		this.getContainerContents(data.path, selectedItem);
	}
	else if(ev.detail === DwtTree.ITEM_EXPANDED){
		selectedItem.setExpanded(true,false,false);
	}
};
com_zimbra_zss_Explorer.prototype.displayRootContainerContents = function(contents) {
	this._hideFetchContentsNotification();
	//Adjust the tree widths to accommodate results.
	this._adjustTreeWidths();
	

	contents =  JSON.parse(contents.text);
	if(contents) {
		if(contents.cloud && contents.cloud.locations) {
			var locations = contents.cloud.locations;
			for(var i = 0, count = locations.length; i < count; i++) {
				var location = locations[i];

				var item = this._addTreeItem({
						className: "mezeo-root DwtTreeItem",
						name: location.name,
						path: location.rootContainer,
						type: this.MEZEO_CONTAINER,
						icon: "Folder",
						id: "mezeo-root",
						headerItem: true,
						content: location
					},
					this.folderExplorer);

				this.getContainerContents(location.rootContainer,item);
			}
		}
	}
};

com_zimbra_zss_Explorer.prototype.getContainerContents = function(path,parentContainer) {
	var dataInCache = this.mezeoCache[path + "/contents"];
	this._showFetchContentsNotification();
	if(!dataInCache) {
		this.queryServer(path + "/contents", new AjxCallback(this, this._handleGetContainerContents, { parent: parentContainer, refetched: false } ));
	}
	else {
		this._handleGetContainerContents( { parent: parentContainer, refetched: true }, dataInCache);
	}
}

com_zimbra_zss_Explorer.prototype._addTreeItem = function(mezeoItem, parent) {
	var treeItemProperties = {
				arrowDisabled: true,
				dynamicWidth: true,
				className: mezeoItem.className,
				index: parent.getChildren().length,
				parent: parent,
				imageInfo : mezeoItem.icon,
				path: mezeoItem.path,
				text: mezeoItem.name,
			}

	var item = mezeoItem.headerItem ? 
				new DwtHeaderTreeItem(treeItemProperties)
				: new DwtTreeItem(treeItemProperties);
	
	if(mezeoItem.isSelected)	{
		item.setChecked(true);
	}
	
	item.setData(this.dataKey,{
		type: mezeoItem.type,
		path: mezeoItem.path,
		content: mezeoItem.content,
		self: item
	});

	return item;
};

com_zimbra_zss_Explorer.prototype._handleGetContainerContents = function(extraData, contents) {
	this._hideFetchContentsNotification();
	var parent = extraData.parent,
		refetched = extraData.refetched;
	this._clearTreeItems(this.fileExplorer);
	// this._clearTreeItems(parent);
	var mezeoContainer, filesTree;
	var contentsJson =  JSON.parse(contents.text);

	if(contentsJson["file-list"]){
		if(contentsJson["file-list"]["file-list"]){
			
			this.mezeoCache[contentsJson["file-list"].uri] = contents;
			
			var containerContents = contentsJson["file-list"]["file-list"];
			this._hideNoFilesFoundMessage();
			
			for(var i = 0, count = containerContents.length; i < count; i++){
				var content = containerContents[i];
				var mezeoItem = {};

				if(content.container && !refetched){
					var item = this._addTreeItem({
						className: "mezeo-container DwtTreeItem",
						name: content.container.name,
						path: content.container.uri,
						type: this.MEZEO_CONTAINER,
						icon: "Folder",
						content: content,
						forceNotifySelection: true,
						headerItem: true
					}, parent);
				}
				if(content.file){
					var item = this._addTreeItem({
						className: "zss-file DwtTreeItem",
						name: this._createFileHtml(content.file),
						path: content.file.uri,
						type: this.MEZEO_FILE,
						icon: "GenericDoc",
						content: content,
						isSelected: this._isFileSelected(content.file.uri)
					}, this.fileExplorer);
					item.enableSelection(false);
				}
			}
			//Show No files found
			if(containerContents.length === 0 || this.fileExplorer.getChildren().length === 0){
				//Add a ghost file to prevent fileExplorer td from collapsing
				this._addGhostFile();
				this._showNoFilesFoundMessage();				
			}

			parent.setExpanded(true,false,false);
		}
	}
}
com_zimbra_zss_Explorer.prototype._isFileSelected = function (fileUri){
	for(var i = 0, len = this.selectedItems.length; i < len; i++){
		if(this.selectedItems[i].path === fileUri){
			return true;
		}
	}
	return false;
};

com_zimbra_zss_Explorer.prototype._clearTreeItems = function(parent){
	while(parent.getChildren().length){
		parent.removeChild(parent.getChildren()[0]);
	}
}

com_zimbra_zss_Explorer.prototype._createFileHtml = function(file) {
	var html = [],
		i = 0;
 	
 	html[i++] = "<div class='zss-file-name'>" + file.name +"</div>";
 	html[i++] = "<div class='zss-file-details'>";
 	html[i++] = "<span class='zss-file-size'>" + AjxUtil.formatSize(file.bytes, true, null) +"</span>";
 	html[i++] = "</div>";

 	return html.join("");
}

com_zimbra_zss_Explorer.prototype.onSelectItem = function(file,selected){
	if(selected) {
		if(this.isFolderExplorer){
			this.clearSelection();	
		}
		this.selectedItems.push(file);
	}
	else {
		for(var i = 0, len = this.selectedItems.length; i < len; i++) {
			if(this.selectedItems[i].path === file.path) {
				this.selectedItems.splice(i,1);
				return;
			}
		}
	}
}

com_zimbra_zss_Explorer.prototype.getSelection = function(){
	// var selectedFiles = this.fileExplorer.getSelection();
	return this.selectedItems;
}

com_zimbra_zss_Explorer.prototype.clearSelection = function(){
	this.fileExplorer.deselectAll();
	for(var i = 0, len = this.selectedItems.length; i < len; i++) {
		this.selectedItems[i].self.setChecked(false);
	}
	this.selectedItems = [];
}


com_zimbra_zss_Explorer.prototype.queryServer = function(extServerUrl, callback, appendHost) {
	extServerUrl = extServerUrl.substring(extServerUrl.indexOf('/zss'));
	var hdrs = [];
	hdrs["X-Client-Specification"] = 3; //must pass the length of data
	hdrs["X-Cloud-Depth"] = 1;
	// url encode the external server url
	// since it will part of the query params for the proxy servet
	var encodedExtServerUrl = AjxStringUtil.urlComponentEncode(extServerUrl);
	
	// submit the URL and asynchronous response (using callback)
	AjxRpc.invoke(null, encodedExtServerUrl, hdrs, callback, true);
};