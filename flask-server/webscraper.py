from selenium import webdriver
from bs4 import BeautifulSoup
from time import sleep

def instructables_call(search_query, max_results=2):
    url = f"https://www.instructables.com/search/?q={search_query}"

    # Set up Selenium WebDriver (Ensure ChromeDriver is installed and its path is correct)
    options = webdriver.ChromeOptions()
    options.headless = True  # Runs the browser in the background (headless mode)
    driver = webdriver.Chrome(options=options)

    driver.get(url)
    sleep(3)  # Let the page load for 3 seconds (you can adjust this)

    # Get the page source after JavaScript has rendered it
    page_source = driver.page_source

    # Now we can parse the HTML with BeautifulSoup
    soup = BeautifulSoup(page_source, "html.parser")

    # Find all project cards
    projects = soup.find_all("div", class_="_ibleCard_1qrfl_24")

    results = []
    for idx, project in enumerate(projects[:max_results]):  # Limit the number of results based on max_results
        title_tag = project.find("a", class_="_title_1qrfl_47")
        link_tag = project.find("a", href=True)
        image_tag = project.find("img", class_="ls-is-cached lazyloaded")

        if title_tag and link_tag and image_tag:
            title = title_tag.text.strip()
            link = "https://www.instructables.com" + link_tag["href"]
            image_url = image_tag["src"]
            
            # Open the individual project page to get the description
            driver.get(link)
            sleep(2)  # Wait for the project page to load

            # Get the page source of the individual project page
            project_page_source = driver.page_source
            project_soup = BeautifulSoup(project_page_source, "html.parser")

            # Extract the description text from the individual project page
            description_section = project_soup.find("section", {"id": "intro"})
            description_text = description_section.get_text(strip=True) if description_section else "No description available"
            
            results.append(
                {
                    'title': title,
                    'img': image_url,
                    'project_link': link,
                    'description': description_text
                }
            )
        
        # Stop if we've reached the max_results limit
        if idx + 1 >= max_results:
            break

    driver.quit()  # Close the browser when done

    return results
