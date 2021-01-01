(function()
{
  function switchTab(id)
  {
    // fetch section, falls back to main
    var tab = document.getElementById(id) || document.getElementById('about')
    // hide all sections
    document.querySelectorAll('section').forEach(function(tab)
    {
      tab.style.display = 'none'
    })
    // show active section
    tab.style.display = ''
    // defer showing content until sections visible, to fix potential content jumping
    var top = document.documentElement.scrollTop
    setTimeout(function()
    {
      // disable default anchor scroll behaviour
      document.documentElement.scrollTop = top
      // show content
      document.body.classList.remove('loading')
    }, 50)
    // adjust menu links state
    document.querySelectorAll('header > nav a').forEach(function(link)
    {
      return link.getAttribute('href') == '#'.concat(tab.id) ? link.classList.add('active') : link.classList.remove('active')
    })
    // unfocus any focused menu elements
    document.activeElement.blur()
  }

  // show content on page load based on url hash if any
  switchTab( location.hash.replace('#', '') )

  window.addEventListener('hashchange', function(event)
  {
    // switch to page view on URL hash changes
    return location.hash && switchTab( location.hash.replace('#', '') )
  })

  document.querySelectorAll('header > nav a').forEach(function(anchor)
  {
    return anchor.addEventListener('click', function(event)
    {
      // disable default behaviour
      event.preventDefault()
      // extract page id from hash
      var hash = event.target.getAttribute('href').replace('#', '')
      // switch view to concerned page
      switchTab( hash )
      // append hash to URL
      return history.replaceState({}, '', '#'.concat(hash))
    }, false)
  })

  document.forms[0].querySelectorAll('input, textarea').forEach(function(field)
  {
    return field.addEventListener('blur', function(event)
    {
      var field = event.target, value = field.value

      // if no input supplied, mark errored field
      if ( ! value.trim() )
        return field.classList.add('error')

      field.classList.remove('default')

      switch ( field.name ) {
        case 'email':
          if ( ! /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            .test(value) ) {
            field.classList.add('error')
          } else {
            field.classList.remove('error')
          }
          break

        default:
          field.classList.remove('error')
          break
      }
    }, false)
  })

  // anti-spam measure
  var MY_EMAIL = [105,64,101,108,104,97,114,100,111,117,109,46,99,111,109].map(String.fromCharCode).join('').replace(/[^a-z\.\@]/g,'')

  // print email
  document.querySelectorAll('.print-email').forEach(function(elem)
  {
    elem.textContent = MY_EMAIL
  })

  document.forms[0].addEventListener('submit', function(event)
  {
    // disable form submission
    event.preventDefault()

    var email = event.target.querySelector('[name=email]')
        , subject = event.target.querySelector('[name=subject]')
        , message = event.target.querySelector('[name=message]')

    // check if field empty/has errors
    if ( ! email.value || email.classList.contains('error') )
      return email.focus()

    // check if field empty/has errors
    if ( ! subject.value || subject.classList.contains('error') )
      return subject.focus()

    // check if field empty/has errors
    if ( ! message.value || message.classList.contains('error') )
      return message.focus()

    // check if any errored fields
    if ( event.target.querySelectorAll('.error').length || event.target.querySelectorAll('.default').length )
      return false

    // redirect to default mail app
    location.assign(
      'mailto:' + MY_EMAIL
      + '?subject=' + encodeURIComponent(subject.value.trim())
      + '&body=' + encodeURIComponent(message.value.trim() + '\n\nFrom: ' + email.value))
  }, false)
})()