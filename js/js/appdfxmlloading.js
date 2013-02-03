/*******************************************************************************
 * Copyright 2012 Vassili Philippov <vassiliphilippov@onepf.org>
 * Copyright 2012 One Platform Foundation <www.onepf.org>
 * Copyright 2012 Yandex <www.yandex.com>
 * 
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 * 
 *        http://www.apache.org/licenses/LICENSE-2.0
 * 
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 ******************************************************************************/

/**
 * Loading description.xml JSON into AppDF editor HTML5 page
 * Depends on: jquery.js, xmlgenerator.js, appdfeditor.js, appdflocalization.js
 */

function loadDescriptionLocalizationSection(languageCode, data) {
	var $container = $("#localization-tab-" + languageCode);

	$container.find("input[id^=description-texts-title-more-]").closest(".control-group").remove();
	var titles = data["texts"]["title"];
	for (var i=0; i<titles.length; i++) {
		var title = titles[i];
		if (i==0) {
			$container.find("#description-texts-title").val(title);
		} else {
			addMoreTitles($container.find("#description-texts-title"), title);
		};
	};	

	$container.find("input[id^=description-texts-keywords-more-]").closest(".keyword-countainer").remove();
	var keywords = data["texts"]["keywords"];
	for (var i=0; i<keywords.length; i++) {
		var keyword = keywords[i];
		if (i==0) {
			$container.find("#description-texts-keywords").val(keyword);
		} else {
			addMoreKeywords($container.find("#description-texts-keywords"), keyword);
		};
	};	

	$container.find("input[id^=description-texts-shortdescription-more-]").closest(".control-group").remove();
	var shoftDescriptions = data["texts"]["short-description"];
	for (var i=0; i<shoftDescriptions.length; i++) {
		var shortDescription = shoftDescriptions[i];
		if (i==0) {
			$container.find("#description-texts-shortdescription").val(shortDescription);
		} else {
			addMoreShortDescriptions($container.find("#description-texts-shortdescription"), shortDescription);
		};
	};	

	$container.find("#description-texts-fulldescription").val(data["texts"]["full-description"]);

	$container.find("input[id^=description-texts-features-]").val("");
	var features = data["texts"]["features"];
	for (var i=0; i<features.length; i++) {
		var feature = features[i];
		if (i<5) {
			$container.find("#description-texts-features-" + (i+1)).val(feature);
		};
	};	

	if (data["texts"]["recent-changes"]) {
		$container.find("#description-texts-recentchanges").val(data["texts"]["recent-changes"]);
	} else {
		$container.find("#description-texts-recentchanges").val("");		
	};

	if (data["texts"]["privacy-policy"]) {
		$container.find("#description-texts-privacypolicy").val(data["texts"]["privacy-policy"]);
	} else {
		$container.find("#description-texts-privacypolicy").val("");		
	};

	if (data["texts"]["eula"]) {
		$container.find("#description-texts-eula").val(data["texts"]["eula"]);
	} else {
		$container.find("#description-texts-eula").val("");		
	};
};

function loadDescriptionXML(xml, onend, onerror) {
	parseDescriptionXML(xml, function(data) {
		console.log("Description.XML is parsed");
		console.log(data);

		//Set control values in the categorization section
		$("#categorization-type").val(data["categorization"]["type"]);
		fillCategories();

		$("#categorization-category").val(data["categorization"]["category"]);
		fillSubcategories();

		$("#categorization-subcategory").val(data["categorization"]["subcategory"]);
		fillCategoryStoresInfo();

		//Set control values in the description/texts
		removeAllLocalizations();
		for (languageCode in data["description"]) {
			if (languageCode!="default") {
				addLocalization(languageCode, allLanguages[languageCode]);
			};
			loadDescriptionLocalizationSection(languageCode, data["description"][languageCode]);
		};

		//Price
		$("input[id^=price-localprice-]").closest(".control-group").remove();
		$("#price-free-fullversion").val("");
		$("#price-baseprice").val("0");
		if (data["price"]["free"]) {
			$('a[href="#tab-price-free"]').tab('show');
			$("#price-free-trialversion").attr("checked", data["price"]["trial-version"]);
			if (data["price"]["trial-version"]) {
				$("#price-free-fullversion").removeAttr('disabled');
			} else {
				$("#price-free-fullversion").attr('disabled', 'disabled');
			};
			if (typeof data["price"]["full-version"] != 'undefined') {
				$("#price-free-fullversion").val(data["price"]["full-version"]);
			};		
		} else {
			$('a[href="#tab-price-paid"]').tab('show');
			$("#price-baseprice").val(data["price"]["base-price"]);			

			$("#price-free-trialversion").attr("checked", false);
			$("#price-free-fullversion").attr('disabled', 'disabled');

			for (countryCode in data["price"]["local-price"]) {
				addMoreLocalPrice($("#price-baseprice"), data["price"]["local-price"][countryCode], countryCode);
			};
		};

		onend();
	}, onerror);
};