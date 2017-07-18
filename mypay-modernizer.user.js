// ==UserScript==
// @name         MyPay Modernizer
// @namespace    http://github.com/kimobu/mypay-modernizer
// @version      0.1
// @description  Makes MyPay look like a more modern wesite
// @author       @kimobu
// @match        https://mypay.dfas.mil/mypay.aspx
// @match        https://mypay.dfas.mil/LES_DJMSA.aspx*
// @match        https://mypay.dfas.mil/myPayMessage*
// @match        https://mypay.dfas.mil/MainMenu*
// @require      https://code.jquery.com/jquery-2.1.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/js/materialize.min.js
// @resource     css https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/css/materialize.min.css
// @resource     icons https://fonts.googleapis.com/icon?family=Material+Icons
// @grant       GM_addStyle
// @grant       GM_getResourceText
// ==/UserScript==

$('body').css("all", "unset");


var css = GM_getResourceText ("css");
GM_addStyle (css);
var icons = GM_getResourceText ("icons");
GM_addStyle (icons);

// Re-enable right click
document.oncontextmenu = null;

if (window.location.href.indexOf('mypay.aspx') > -1) {
  modernizeMain();
}
if (window.location.href.indexOf('LES') > -1) {
  modernizeLes();
}
if (window.location.href.indexOf('myPayMessage') > -1 || window.location.href.indexOf('MainMenu') > -1) {
    modernizeMenu();
}

function buildBody(logout_url, links) {
    header_outer = document.createElement('nav');
    header_outer.classList.add('blue');
    header_inner = document.createElement('div');
    header_inner.classList.add('nav-wrapper', 'container');
    title = document.createElement('a');
    title.classList.add('brand-logo');
    title.href = "/";
    title.textContent = "🇺🇸 MyPay 💵";
    if( logout_url ) {
        menu = $('<ul>').addClass('right');
        logout = $('<a>').attr('href', logout_url).text("Logout").addClass('white-text');
        $(menu).append(logout);
        $(header_inner).append(menu);
    }
    if ( links ) {
      menu = $('<ul>').addClass('right hide-on-med-and-down');
      $(links).each(function(index) {
        menu_item = $('<li>');
        link = $('<a>').attr('href', $(this).attr('href')).text($(this).attr('name')).addClass('white-text');
        $(menu_item).append(link);
        $(menu).append(menu_item);
      });
      $(header_inner).append(menu);

      menu = $('<ul>').addClass('side-nav').attr('id','nav-mobile');
      $(links).each(function(index) {
        menu_item = $('<li>');
        link = $('<a>').attr('href', $(this).attr('href')).text($(this).attr('name')).addClass('white-text');
        $(menu_item).append(link);
        $(menu).append(menu_item);
      });
      menu_btn = $('<a>').attr('data-activates', 'nav-mobile').addClass('button-collapse').attr('href', '#');
      menu_icon = $('<i>').addClass('material-icons').text('menu');
      $(menu_btn).append(menu_icon);
      $(header_inner).append(menu);
      $(header_inner).append(menu_btn);
    }
    $(header_inner).append(title);
    $(header_outer).append(header_inner);
    if (window.location.href.indexOf('myPayMessage') > -1 || window.location.href.indexOf('LES') > -1) {
        $('body').prepend(header_outer);
    } else {
        $('body').append(header_outer);
    }
    $('body').css('background-color', '#f5f5f5');
}

function scrapeMain () {
    var dom_elements = [];
    dom_elements.username_input = document.getElementById('visLogin');
    dom_elements.password_input = document.getElementById('visPin');
    dom_elements.login_submit = document.getElementById('cmdGo');
    dom_elements.cac_submit = document.getElementById('cmdCAC');
    dom_elements.forgot_password = "javascript:winopen('PinLetter.aspx','mpeex')";
    dom_elements.forgot_username = "javascript:winopen('GetLoginID.aspx','mpeex')";
    dom_elements.create_user = "javascript:winopen('myPayEnroll.aspx','mpeex')";
    dom_elements.news = document.getElementById('ctlPanel').getElementsByTagName('table');
    dom_elements.links = document.getElementById('QuickTable').getElementsByTagName('a');
    dom_elements.warning = document.getElementById('WarningTable');

    return dom_elements;
}

function scrapeLes() {
  var dom_elements = [];
  dom_elements.links = $('#header').find('a');
  dom_elements.les_select = $('#LesDropDownList');
  dom_elements.les_select_submit = $('#GoButton');
  dom_elements.personal_info = [];
  p_info  = $('#Table1').find('tr').eq(1);
  dom_elements.personal_info.push( { name: "Name", value: $(p_info).find('b').eq(1).text() } );
  dom_elements.personal_info.push( { name: "SSN", value: $(p_info).find('b').eq(2).text() } );
  dom_elements.personal_info.push( { name: "Grade", value: $(p_info).find('b').eq(3).text() } );
  dom_elements.personal_info.push( { name: "Pay Date", value: $(p_info).find('b').eq(4).text() } );
  dom_elements.personal_info.push( { name: "Years of service", value: $(p_info).find('b').eq(5).text() } );
  dom_elements.personal_info.push( { name: "ETS", value: $(p_info).find('b').eq(6).text() } );
  dom_elements.personal_info.push( { name: "Branch", value: $(p_info).find('b').eq(7).text() } );
  dom_elements.personal_info.push( { name: "ADSN", value: $(p_info).find('b').eq(8).text() } );
  dom_elements.personal_info.push( { name: "Check period", value: $(p_info).find('b').eq(9).text() } );
  dom_elements.total_entitlements = $('#Table6').first('font').text().trim();
  dom_elements.total_deductions = $('#Table8').first('font').text().trim();
  dom_elements.total_allotments = $('#Table10').first('font').text().trim();
  dom_elements.net_pay = $('#Table11').find('tr').eq(3).find('font').eq(1).text().trim();
  dom_elements.entitlement_elements = [];
  entitlements = $('#tblEntitlements');
  ents=$(entitlements).find('font')[0];
  ents2=$(ents).html().split('<br>');
  ent_money=$(entitlements).find('font')[1];
  ent_money2=$(ent_money).html().split('<br>');
  for(i=0;i<ents2.length;i++) { 
	if(ents2[i] === "") {
		continue;
    }
	dom_elements.entitlement_elements.push( { name: ents2[i].trim(), value: ent_money2[i].trim() } );
  }
  deductions = $('#tblDeductions');
  dom_elements.deduction_elements = [];
  deds=$(deductions).find('font')[0];
  deds2=$(deds).html().split('<br>');
  ded_money=$(deductions).find('font')[1];
  ded_money2=$(ded_money).html().split('<br>');
  for(i=0;i<deds2.length;i++) { 
	if(deds2[i] === "") {
		continue;
    }
	dom_elements.deduction_elements.push( { name: deds2[i].trim(), value: ded_money2[i].trim() } );
  }
  allotments = $('#tblAllotments');
  dom_elements.allotment_elements = [];
  alls=$(allotments).find('font')[0];
  alls2=$(alls).html().split('<br>');
  all_money=$(allotments).find('font')[1];
  all_money2=$(all_money).html().split('<br>');
  for(i=0;i<alls2.length;i++) { 
	if(alls2[i] === "") {
		continue;
    }
	dom_elements.allotment_elements.push( { name: alls2[i].trim(), value: all_money2[i].trim() } );
  }
  l_info = $('#Table1').find('tr').eq(23);
  dom_elements.leave_info = [];
  dom_elements.leave_info.push( { name: "Before", value: $(l_info).find('b').eq(1).text() } );
  dom_elements.leave_info.push( { name: "Earned", value: $(l_info).find('b').eq(2).text() } );
  dom_elements.leave_info.push( { name: "Used", value: $(l_info).find('b').eq(3).text() } );
  dom_elements.leave_info.push( { name: "Balance", value: $(l_info).find('b').eq(4).text() } );
  dom_elements.leave_info.push( { name: "ETS Balance", value: $(l_info).find('b').eq(5).text() } );
  dom_elements.leave_info.push( { name: "Lost", value: $(l_info).find('b').eq(6).text() } );
  dom_elements.leave_info.push( { name: "Leave Paid", value: $(l_info).find('b').eq(7).text() } );
  dom_elements.leave_info.push( { name: "Use or Lose", value: $(l_info).find('b').eq(8).text() } );
  dom_elements.tax_info = [];
  dom_elements.tax_info.push( { name: "Federal taxable wages this period", value: $(l_info).find('b').eq(10).text() } );
  dom_elements.tax_info.push( { name: "Federal taxable wages year to date", value: $(l_info).find('b').eq(11).text() } );
  dom_elements.tax_info.push( { name: "Married or single", value: $(l_info).find('b').eq(12).text() } );
  dom_elements.tax_info.push( { name: "# of federal exemptions", value: $(l_info).find('b').eq(13).text() } );
  dom_elements.tax_info.push( { name: "Additional taxes witheld", value: $(l_info).find('b').eq(14).text() } );
  dom_elements.tax_info.push( { name: "Federal taxes year to date", value: $(l_info).find('b').eq(15).text() } );
  tax_table = $('#Table12');
  fica = $(tax_table).find('tr').eq(0);
  dom_elements.tax_info.push( { name: "OASDI - Taxable Wages", value: $(fica).find('b').eq(1).text() } );
  dom_elements.tax_info.push( { name: "OASDI - Taxable Wages (year to date)", value: $(fica).find('b').eq(2).text() } );
  dom_elements.tax_info.push( { name: "OASDI (year to date)", value: $(fica).find('b').eq(3).text() } );
  dom_elements.tax_info.push( { name: "Medicare taxable wages", value: $(fica).find('b').eq(4).text() } );
  dom_elements.tax_info.push( { name: "Medicare taxes (year to date)", value: $(fica).find('b').eq(5).text() } );
  dom_elements.tax_info.push( { name: "Claimed state", value: $(fica).find('b').eq(7).text() } );
  dom_elements.tax_info.push( { name: "State taxable wages (this period)", value: $(fica).find('b').eq(8).text() } );
  dom_elements.tax_info.push( { name: "State taxable wages (year to date)", value: $(fica).find('b').eq(9).text() } );
  dom_elements.tax_info.push( { name: "Married or single (state)", value: $(fica).find('b').eq(10).text() } );
  dom_elements.tax_info.push( { name: "# of state exemptions", value: $(fica).find('b').eq(11).text() } );
  dom_elements.tax_info.push( { name: "State taxes year to date", value: $(fica).find('b').eq(12).text() } );
  bah = $(tax_table).find('tr').eq(1);
  dom_elements.bah_type = $(bah).find('b').eq(1).text();
  tsp_table = $('#Table13');
  tsp = $(tsp_table).find('tr').eq(0);
  dom_elements.tsp = [];
  dom_elements.tsp.push({ name: "Base pay (%)", value: $(tsp).find('b').eq(1).text().trim() + " %" });
  dom_elements.tsp.push( { name: "Base pay ($)", value: "$ " + $(tsp).find('b').eq(2).text().trim() } );
  dom_elements.tsp.push( { name: "Special pay (%)", value: $(tsp).find('b').eq(3).text().trim() + " %" } );
  dom_elements.tsp.push( { name: "Special pay ($)", value: "$ " + $(tsp).find('b').eq(4).text().trim() } );
  dom_elements.tsp.push( { name: "Incidental pay (%)", value: $(tsp).find('b').eq(5).text().trim() + " %" } );
  dom_elements.tsp.push( { name: "Incidental pay ($)", value: "$ " + $(tsp).find('b').eq(6).text().trim() } );
  dom_elements.tsp.push( { name: "Bonus pay (%)", value: (tsp).find('b').eq(7).text().trim() + " %" } );
  dom_elements.tsp.push( { name: "Bonus pay ($)", value: "$ " + $(tsp).find('b').eq(8).text().trim() } );
  roth = $(tsp_table).find('tr').eq(1);
  dom_elements.roth = [];
  dom_elements.roth.push( { name: "Roth base pay (%)", value: $(roth).find('b').eq(1).text().trim() + " %" } );
  dom_elements.roth.push( { name: "Roth base pay ($)", value: "$ " + $(roth).find('b').eq(2).text().trim() } );
  dom_elements.roth.push( { name: "Roth special pay (%)", value: $(roth).find('b').eq(3).text().trim() + " %" } );
  dom_elements.roth.push( { name: "Roth special pay ($)", value: "$ " + $(roth).find('b').eq(4).text().trim() } );
  dom_elements.roth.push( { name: "Roth incidental pay (%)", value: $(roth).find('b').eq(5).text().trim() + " %" } );
  dom_elements.roth.push( { name: "Roth incidental pay ($)", value: "$ " + $(roth).find('b').eq(6).text().trim() } );
  dom_elements.roth.push( { name: "Roth bonus pay (%)", value: $(roth).find('b').eq(7).text().trim() + " %" } );
  dom_elements.roth.push( { name: "Roth bonus pay ($)", value: "$ " + $(roth).find('b').eq(8).text().trim() } );
  tsp_totals = $(tsp_table).find('tr').eq(2);
  dom_elements.tsp_ytd_deductions = { name: "Total deductions for TSP year to date", value: $(tsp_totals).find('b').eq(1).text().trim() };
  dom_elements.tsp_ytd_deferred = { name: "Total deferred for TSP year to date", value: $(tsp_totals).find('b').eq(2).text().trim() };
  dom_elements.tsp_ytd_exempt = { name: "Total exempt for TSP year to date", value: $(tsp_totals).find('b').eq(3).text().trim() };
  dom_elements.tsp_ytd_roth = { name: "Total contributions to Roth TSP year to date", value: $(tsp_totals).find('b').eq(4).text().trim() };
  remarks = $('#Table16').find('tr').eq(0);
  dom_elements.ytd_entitlements = { name: "Total pay year to date", value: $(remarks).find('u').eq(0).text().trim() };
  dom_elements.ytd_deductions = { name: "Total deductions year to date", value: $(remarks).find('u').eq(1).text().trim() };
  dom_elements.messages = $('#Table16').find('tbody').eq(1);
  return dom_elements;
}

function modernizeMain () {
    old_dom = scrapeMain();
    body = document.getElementsByTagName('body')[0];
    document.getElementById('TableHeader').remove();
    document.getElementById('MainTable').remove();
    document.getElementById('WarningTable').remove();
    document.getElementById('tblMessage').remove();
    buildBody();

    // build the new dom
    // First: a login box. left side is username/password. right side is cac
    var login_row = $('<div>').addClass('row center-align').css("margin-top","20px");
    var login_div = $('<div>').addClass('col s12 m6 offset-m3');
    var username_row = $('<div>').addClass('row');
    var username_password_div = $('<div>').addClass('col s12 m6');
    var username_div = $('<div>').addClass('input-field col s12');
    var username_label = $('<label>').attr('for','visLogin').text('Username');
    $(username_div).append(old_dom.username_input);
    $(username_div).append(username_label);
    var password_row = $('<div>').addClass('row');
    var password_div = $('<div>').addClass('input-field col s12');
    var password_label = $('<label>').attr('for','visPin').text('Password');
    $(password_div).append(old_dom.password_input);
    $(password_div).append(password_label);
    var login_submit_row = $('<div>').addClass('row');
    $(old_dom.login_submit).addClass('btn blue waves-effect waves-white white-text').val('Username Login').css("font-weight", "").css('width','');
    $(username_row).append(username_div);
    $(password_row).append(password_div);
    $(login_submit_row).append(old_dom.login_submit);
    $(username_password_div).append(username_row).append(password_row).append(login_submit_row);

    // Cac
    var cac_div = $('<div>').addClass('col s12 m6');
    var cac_icon_row = $('<div>').addClass('row');
    var cac_icon = $('<img>').attr('src', 'http://archive.defense.gov/DODCMSShare/NewsStoryPhoto/2015-06/hrs_W%20Sample%20MilCiv%20CAC.jpg');
    cac_icon.css ( {
        width:      "128px"
    } );
    var cac_login_row = $('<div>').addClass('row center-align');
    var cac_submit = $('<button>').addClass('btn blue waves-effect waves-white white-text').text('CAC Login').on('click', function() {
        var url = 'Smartcheck/SmartCheck.aspx';
        var a = 'mpeex';
        var features = 'toolbar=yes,location=yes,directories=no,status=yes,menubar=yes,scrollbars=yes,resizable=no,top=0,left=0';
        newwin = window.open(url, a, features);
        document.forms[1].action = url;
        document.forms[1].submit();
    });

    $(cac_icon_row).append(cac_icon);
    $(cac_login_row).append(cac_submit);
    $(cac_div).append(cac_icon_row).append(cac_login_row);
    $(login_div).append(username_password_div).append(cac_div);
    var help_row = $('<div>').addClass('row');
    var user_help = $('<a>').attr("href", old_dom.forgot_username).text("Forgot username");
    var pass_help = $('<a>').attr("href", old_dom.forgot_password).text("Forgot password");
    var create_login = $('<a>').attr("href", old_dom.create_user).text("Create an account");
    var help_col1 = $('<div>').addClass('col s4').append(user_help);
    var help_col2 = $('<div>').addClass('col s4').append(pass_help);
    var help_col3 = $('<div>').addClass('col s4').append(create_login);
    $(help_row).append(help_col1).append(help_col2).append(help_col3);
    $(login_div).append(help_row);
    $(login_row).append(login_div);


    // Second: all the other crap the main page display
    var info_row = $('<div>').addClass('row');
    var news_div = $('<div>').addClass('col s12 m6');
    var news = $('<ul>').addClass('collection');
    $(old_dom.news).each(function(index) {
        if(index === 0) {
             news_item = $('<li>').addClass('collection-item');
             item_title = $('<h5>').text("");
             availability = $(this).find('td:contains(System Availability)').parent().nextAll();
             item_text = $('<p>');
             $(availability).each(function(index) {
               $(item_text).html($(item_text).html() + $(this).find('.blocks').html() );
             });

        } else {
            spans = $(this).find('span');
             news_item = $('<li>').addClass('collection-item');
             item_title = $('<h5>').text($(spans[0]).text());
             item_text = $('<p>').text($(spans[1]).text());
        }
        $(news_item).append(item_title).append(item_text);
        $(news).append(news_item);
    });
    var links_div = $('<div>').addClass('col s12 m6');
    var links = $('<div>').addClass('collection');
    $(old_dom.links).each(function(index) {
        $(this).addClass('collection-item');
        $(links).append($(this));
    });

    var warning_row = $('<div>').addClass('row');
    var warning_div = $('<div>').addClass('col s12 l6 offset-l3 card red darken-2 white-text');
    $(warning_div).append($(old_dom.warning).find('.footer').text());
    $(warning_row).append(warning_div);
    // add all the new elements
    $(news_div).append(news);
    $(links_div).append(links);
    $(info_row).append(news_div).append(links_div);
    $(body).append(login_row).append(info_row).append(warning_row);
}

function modernizeLes () {
    old_dom = scrapeLes();
    $('#Form1').children('table').remove();
    $('#Form1').children('br').remove();
    $('#Panel2').remove();
    buildBody(null, old_dom.links);
    first_row = $('<div>').addClass('row');
    person_div = $('<div>').addClass('col l4 m4 hide-on-small-only');
    person_card = $('<div>').addClass('card');
    person_card_content = $('<div>').addClass('card-content');
    les_select = $('<div>').addClass('input-field col s12');
    les_label = $('<label>').text('Choose LES');
    $(les_select).append(old_dom.les_select);
    $(les_select).append(les_label);
    $(person_card_content).append(les_select);
    $(old_dom.les_select).on('change', function() { $('#Form1').submit(); });
    $(old_dom.les_select_submit).addClass('hide');
    $(person_card_content).append(old_dom.les_select_submit);
    person_info_table = $('<table>');
    person_info_table_body = $('<tbody>');
    $(old_dom.personal_info).each(function(index) {
      var row = $('<tr>');
      var col1 = $('<td>').text(this.name);
      var col2 = $('<td>').text(this.value);
      $(row).append(col1).append(col2);
      $(person_info_table_body).append(row);
    });
    $(person_info_table).append(person_info_table_body);
    $(person_card_content).append(name).append(person_info_table);
    $(person_card).append(person_card_content);
    $(person_div).append(person_card);

    summary_div = $('<div>').addClass('col s12 m8 l4');
    summary_card = $('<div>').addClass('card');
    summary_card_content = $('<div>').addClass('card-content');
    title = $('<span>').addClass('card-title').text('Summary');
    summary_table = $('<table>').addClass('striped');
    summary_table_body = $('<tbody>');
    row1 = $('<tr>');
    col1 = $('<td>').text("Total pay (year to date)");
    col2 = $('<td>').text(old_dom.total_entitlements + " (" + old_dom.ytd_entitlements.value + ")");
    $(row1).append(col1).append(col2);
    row2 = $('<tr>');
    col1 = $('<td>').text("Total deductions (year to date)");
    col2 = $('<td>').text(old_dom.total_deductions + " (" + old_dom.ytd_deductions.value + ")");
    $(row2).append(col1).append(col2);
    row3 = $('<tr>');
    col1 = $('<td>').text("Total allotments");
    col2 = $('<td>').text(old_dom.total_allotments);
    $(row3).append(col1).append(col2);
    row4 = $('<tr>');
    col1 = $('<td>').text("Net pay").css("font-weight","bold");
    col2 = $('<td>').text(old_dom.net_pay).css("font-weight","bold");
    $(row4).append(col1).append(col2);
    $(summary_table_body).append(row1).append(row2).append(row3).append(row4);
    $(summary_table).append(summary_table_body);
    $(summary_card_content).append(title).append(summary_table);
    $(summary_card).append(summary_card_content);
    $(summary_div).append(summary_card);

    leave_div = $('<div>').addClass('col s12 m8 l4');
    leave_card = $('<div>').addClass('card');
    leave_card_content = $('<div>').addClass('card-content');
    title = $('<span>').addClass('card-title').text('Leave');
    leave_table = $('<table>').addClass('striped');
    leave_table_body = $('<tbody>');
    table_string = '';
    $(old_dom.leave_info).each(function(index) {
      if(index % 2 == 0 || index === 0) {
          table_string += '<tr>';
          table_string += '<td>' + this.name + '</td>';
          table_string += '<td>' + this.value + '</td>';
      } else {
          table_string += '<td>' + this.name + '</td>';
          table_string += '<td>' + this.value + '</td>';
          table_string += '</tr>';
      }
    });
    $(leave_table_body).html(table_string);
    $(leave_table).append(leave_table_body);
    $(leave_card_content).append(title).append(leave_table);
    $(leave_card).append(leave_card_content);
    $(leave_div).append(leave_card);
    
    pay_details = $('<div>').addClass('col s12 m8');
    details_card = $('<div>').addClass('card');
    details_card_content = $('<div>').addClass('card-content');
    title = $('<span>').addClass('card-title').text('Pay Details');
    details_table = $('<table>').addClass('striped');
    details_table_body = $('<tbody>');
    $(old_dom.entitlement_elements).each(function(index) {
        var row = $('<tr>');
        var name = $('<td>').text(this.name);
        var val = $('<td>').text("+ " + this.value).addClass('green-text');
        $(row).append(name).append(val);
        $(details_table_body).append(row);
    });
    $(old_dom.deduction_elements).each(function(index) {
        var row = $('<tr>');
        var name = $('<td>').text(this.name);
        var val = $('<td>').text("- " + this.value).addClass('red-text');
        $(row).append(name).append(val);
        $(details_table_body).append(row);
    });
    $(old_dom.allotment_elements).each(function(index) {
        var row = $('<tr>');
        var name = $('<td>').text(this.name);
        var val = $('<td>').text("- " + this.value).addClass('red-text');
        $(row).append(name).append(val);
        $(details_table_body).append(row);
    });
    $(details_table).append(details_table_body);
    $(details_card_content).append(title).append(details_table);
    $(details_card).append(details_card_content);
    $(pay_details).append(details_card);

    $(first_row).append(person_div).append(summary_div).append(leave_div).append(pay_details);

    second_row = $('<div>').addClass('row');
    tax_div = $('<div>').addClass('col s12 l6');
    tax_card = $('<div>').addClass('card');
    tax_card_content = $('<div>').addClass('card-content');
    title = $('<span>').addClass('card-title').text('Tax');

    tax_table = $('<table>').addClass('striped');
    tax_table_body = $('<tbody>');
    table_string = '';
    $(old_dom.tax_info).each(function(index) {
      if(index % 2 == 0) {
          table_string += '<tr>';
          table_string += '<td>' + this.name + '</td>';
          table_string += '<td>' + this.value + '</td>';
      } else {
          table_string += '<td>' + this.name + '</td>';
          table_string += '<td>' + this.value + '</td>';
          table_string += '</tr>';
      }
    });
    $(tax_table_body).html(table_string);
    $(tax_table).append(tax_table_body);
    $(tax_card_content).append(title).append(tax_table);
    $(tax_card).append(tax_card_content);
    $(tax_div).append(tax_card);

    $(second_row).append(tax_div);

    third_row = $('<div>').addClass('row');
    tsp_div = $('<div>').addClass('col s12 l6');
    tsp_card = $('<div>').addClass('card');
    tsp_card_content = $('<div>').addClass('card-content');
    title = $('<span>').addClass('card-title').text('Thrift Savings Plan');

    tsp_table = $('<table>').addClass('striped');
    tsp_table_body = $('<tbody>');
    table_string = '';
    first_tr = $('<tr>');
    ytd_ded = $('<td>').text("YTD Deductions: " + old_dom.tsp_ytd_deductions.value);
    ytd_def = $('<td>').text("YTD Deferred: " + old_dom.tsp_ytd_deferred.value);
    ytd_ex = $('<td>').text("YTD Exempt: " + old_dom.tsp_ytd_exempt.value);
    ytd_roth = $('<td>').text("YTD Roth: " + old_dom.tsp_ytd_roth.value);
    $(first_tr).append(ytd_ded).append(ytd_def).append(ytd_ex).append(ytd_roth);
    $(tsp_table_body).append(first_tr);
    $(old_dom.tsp).each(function(index) {
      if(index % 2 == 0) {
          table_string += '<tr>';
          table_string += '<td>' + this.name + '</td>';
          table_string += '<td>' + this.value + '</td>';
      } else {
          table_string += '<td>' + this.name + '</td>';
          table_string += '<td>' + this.value + '</td>';
          table_string += '</tr>';
      }
    });
    $(old_dom.roth).each(function(index) {
      if(index % 2 == 0) {
          table_string += '<tr>';
          table_string += '<td>' + this.name + '</td>';
          table_string += '<td>' + this.value + '</td>';
      } else {
          table_string += '<td>' + this.name + '</td>';
          table_string += '<td>' + this.value + '</td>';
          table_string += '</tr>';
      }
    });
    $(tsp_table_body).html($(tsp_table_body).html() + table_string);
    $(tsp_table).append(tsp_table_body);
    $(tsp_card_content).append(title).append(tsp_table);
    $(tsp_card).append(tsp_card_content);
    $(tsp_div).append(tsp_card);

    $(second_row).append(tsp_div);

    fourth_row = $('<div>').addClass('row');
    message_div = $('<div>').addClass('col s12');
    message_card = $('<div>').addClass('card');
    message_card_content = $('<div>').addClass('card-content');
    title = $('<span>').addClass('card-title').text('Messages');
    $(message_card_content).append(title);
    $(old_dom.messages).find('font').each(function(index) {
      p = $('<p>').text($.camelCase($(this).text().trim()));
      $(message_card_content).append(p);
    });
    
    $(message_card).append(message_card_content);
    $(message_div).append(message_card);

    $(fourth_row).append(message_div);

    $('#Form1').append(first_row).append(second_row).append(third_row).append(fourth_row);
    $('select').material_select();

}

function modernizeMenu() {
    logout_url = $('a').attr('href');
    var links = $('.lastlogin').parents('table').find('a');
    $('#myPayHeader').remove();
    $('#pnlMessage').remove();
    $('#header').remove();
    buildBody(logout_url, null);
    var links_row = $('<div>').addClass('row').css("margin-top", "20px");
    var links_div = $('<div>').addClass('col s12 l6 offset-l3');
    var links_ul = $('<div>').addClass('collection');
    $(links).each(function(index) {
        $(this).addClass('collection-item');
        $(links_ul).append($(this));
    });
    $(links_div).append(links_ul);
    $(links_row).append(links_div);
    $('body').append(links_row);
    $('[type=submit]').addClass("waves-effect waves-light btn");
}
(function() {
    'use strict';


})();
